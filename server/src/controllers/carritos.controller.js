// ============================================================================
// Archivo: carritos.controller.js
// Contexto: Controlador de carritos para la API de La Montaña.
// Alcance: Carrito activo por usuario autenticado (solo productos),
//          cálculo de totales, CRUD de items sobre tablas normalizadas.
// Métodos exportados:
//   - obtenerCarrito, agregarItem, actualizarCantidad, eliminarItem
// ============================================================================

import crypto from "crypto";
import db from "../../database/db.js";
import { crearError, respuestaExitosa } from "../utils/respuestas.js";

const generarId = () => crypto.randomBytes(10).toString("hex");
const ahora = () => new Date().toISOString();

const selectCarritoActivo = db.prepare(
  "SELECT * FROM carritos WHERE usuarioId = ? AND estado = 1 LIMIT 1"
);
const selectCarritoById = db.prepare("SELECT * FROM carritos WHERE id = ? LIMIT 1");
const insertCarritoStmt = db.prepare(
  `INSERT INTO carritos (id, usuarioId, estado, items, total, creadoEn, actualizadoEn)
   VALUES (?, ?, 1, '[]', 0, ?, ?)`
);
const selectProductoById = db.prepare("SELECT * FROM productos WHERE id = ? LIMIT 1");
const selectCarritoItems = db.prepare(
  `SELECT productoId, cantidad, precioUnitario, nombre, descripcion, imagen, categoria
   FROM carrito_items
   WHERE carritoId = ?
   ORDER BY actualizadoEn DESC, creadoEn DESC`
);
const upsertCarritoItem = db.prepare(`
  INSERT INTO carrito_items (
    id, carritoId, productoId, cantidad, precioUnitario, nombre, descripcion, imagen, categoria, creadoEn, actualizadoEn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(carritoId, productoId)
  DO UPDATE SET
    cantidad = carrito_items.cantidad + excluded.cantidad,
    precioUnitario = excluded.precioUnitario,
    nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    imagen = excluded.imagen,
    categoria = excluded.categoria,
    actualizadoEn = excluded.actualizadoEn
`);
const updateCantidadItem = db.prepare(
  "UPDATE carrito_items SET cantidad = ?, actualizadoEn = ? WHERE carritoId = ? AND productoId = ?"
);
const deleteItem = db.prepare("DELETE FROM carrito_items WHERE carritoId = ? AND productoId = ?");
const countItem = db.prepare(
  "SELECT COUNT(1) AS cantidad FROM carrito_items WHERE carritoId = ? AND productoId = ?"
);
const countItemsByCarrito = db.prepare("SELECT COUNT(1) AS cantidad FROM carrito_items WHERE carritoId = ?");
const calcTotalByCarrito = db.prepare(
  "SELECT COALESCE(SUM(cantidad * precioUnitario), 0) AS total FROM carrito_items WHERE carritoId = ?"
);
const updateCarritoLegacy = db.prepare(
  "UPDATE carritos SET items = ?, total = ?, actualizadoEn = ? WHERE id = ?"
);

const normalizarItem = (item, productoDb) => {
  const precioRequest = Number(item?.precioUnitario);
  const precioProducto = Number(productoDb?.precio) || 0;

  return {
    productoId: productoDb.id,
    tipo: "producto",
    cantidad: Math.max(1, Number(item?.cantidad) || 1),
    precioUnitario: Number.isFinite(precioRequest) && precioRequest >= 0 ? precioRequest : precioProducto,
    nombre: item?.nombre || productoDb.nombre || "",
    descripcion: item?.descripcion || productoDb.descripcion || "",
    imagen: item?.imagen || "",
    categoria: item?.categoria || productoDb.categoria || "",
  };
};

const normalizarItemResponse = (row) => ({
  productoId: row.productoId,
  tipo: "producto",
  cantidad: Number(row.cantidad) || 0,
  precioUnitario: Number(row.precioUnitario) || 0,
  nombre: row.nombre || "",
  descripcion: row.descripcion || "",
  imagen: row.imagen || "",
  categoria: row.categoria || "",
});

const obtenerItemsCarrito = (carritoId) =>
  selectCarritoItems.all(carritoId).map((row) => normalizarItemResponse(row));

const sincronizarCarrito = (carritoId) => {
  const items = obtenerItemsCarrito(carritoId);
  const total = Number(calcTotalByCarrito.get(carritoId)?.total) || 0;
  updateCarritoLegacy.run(JSON.stringify(items), total, ahora(), carritoId);
  return { items, total };
};

const migrarLegacyItemsSiFaltan = (carrito) => {
  const existentes = Number(countItemsByCarrito.get(carrito.id)?.cantidad) || 0;
  if (existentes > 0) return;

  let legacy = [];
  try {
    legacy = JSON.parse(carrito.items || "[]");
  } catch {
    legacy = [];
  }
  if (!Array.isArray(legacy) || legacy.length === 0) return;

  const tx = db.transaction((itemsLegacy) => {
    for (const raw of itemsLegacy) {
      const productoId = String(raw?.productoId || raw?.id || "").trim();
      if (!productoId) continue;
      const producto = selectProductoById.get(productoId);
      if (!producto) continue;

      const item = normalizarItem(raw, producto);
      const ahoraStr = ahora();
      upsertCarritoItem.run(
        generarId(),
        carrito.id,
        item.productoId,
        item.cantidad,
        item.precioUnitario,
        item.nombre,
        item.descripcion,
        item.imagen,
        item.categoria,
        ahoraStr,
        ahoraStr
      );
    }
  });

  tx(legacy);
};

const obtenerOCrearCarrito = (usuarioId) => {
  const existente = selectCarritoActivo.get(usuarioId);
  if (existente) {
    migrarLegacyItemsSiFaltan(existente);
    return existente;
  }

  const id = generarId();
  const ahoraStr = ahora();
  insertCarritoStmt.run(id, usuarioId, ahoraStr, ahoraStr);
  return selectCarritoById.get(id);
};

const obtenerCarrito = async (req, res, next) => {
  const usuarioId = req.user?.uid;
  if (!usuarioId) {
    return next(crearError("No autorizado", 401));
  }

  try {
    const carrito = obtenerOCrearCarrito(usuarioId);
    const { items, total } = sincronizarCarrito(carrito.id);

    return respuestaExitosa(res, {
      data: {
        id: carrito.id,
        usuarioId: carrito.usuarioId,
        estado: carrito.estado === 1,
        items,
        total,
      },
      mensaje: "Carrito obtenido",
    });
  } catch (error) {
    next(error);
  }
};

const agregarItem = async (req, res, next) => {
  const usuarioId = req.user?.uid;
  const { item } = req.body;

  if (!usuarioId) {
    return next(crearError("No autorizado", 401));
  }
  if (!item?.productoId) {
    return next(crearError("productoId es requerido", 400));
  }
  if (item.tipo && item.tipo !== "producto") {
    return next(crearError("Solo se pueden agregar productos al carrito", 400));
  }

  try {
    const carrito = obtenerOCrearCarrito(usuarioId);
    const producto = selectProductoById.get(item.productoId);
    if (!producto || producto.disponible === 0) {
      return next(crearError("Producto no encontrado o no disponible", 404));
    }

    const normalizado = normalizarItem(item, producto);
    const ahoraStr = ahora();

    upsertCarritoItem.run(
      generarId(),
      carrito.id,
      normalizado.productoId,
      normalizado.cantidad,
      normalizado.precioUnitario,
      normalizado.nombre,
      normalizado.descripcion,
      normalizado.imagen,
      normalizado.categoria,
      ahoraStr,
      ahoraStr
    );

    const { items, total } = sincronizarCarrito(carrito.id);

    return respuestaExitosa(res, {
      status: 201,
      mensaje: "Producto agregado al carrito",
      data: { id: carrito.id, items, total },
    });
  } catch (error) {
    next(error);
  }
};

const validarAccesoCarrito = (carritoId, userUid) => {
  const carrito = selectCarritoById.get(carritoId);
  if (!carrito) {
    throw crearError("Carrito no encontrado", 404);
  }
  if (carrito.usuarioId !== userUid) {
    throw crearError("No autorizado", 403);
  }
  return carrito;
};

const actualizarCantidad = async (req, res, next) => {
  const { carritoId, productoId } = req.params;
  const { cantidad } = req.body;

  if (!carritoId || !productoId) {
    return next(crearError("carritoId y productoId son requeridos", 400));
  }

  try {
    validarAccesoCarrito(carritoId, req.user?.uid);

    const existe = Number(countItem.get(carritoId, productoId)?.cantidad) || 0;
    if (!existe) {
      return next(crearError("Producto no encontrado en el carrito", 404));
    }

    if (Number(cantidad) <= 0) {
      deleteItem.run(carritoId, productoId);
    } else {
      updateCantidadItem.run(Math.max(1, Number(cantidad) || 1), ahora(), carritoId, productoId);
    }

    const { items, total } = sincronizarCarrito(carritoId);

    return respuestaExitosa(res, {
      mensaje: "Cantidad actualizada",
      data: { id: carritoId, items, total },
    });
  } catch (error) {
    next(error);
  }
};

const eliminarItem = async (req, res, next) => {
  const { carritoId, productoId } = req.params;

  if (!carritoId || !productoId) {
    return next(crearError("carritoId y productoId son requeridos", 400));
  }

  try {
    validarAccesoCarrito(carritoId, req.user?.uid);

    const existe = Number(countItem.get(carritoId, productoId)?.cantidad) || 0;
    if (!existe) {
      return next(crearError("Producto no encontrado en el carrito", 404));
    }

    deleteItem.run(carritoId, productoId);

    const { items, total } = sincronizarCarrito(carritoId);

    return respuestaExitosa(res, {
      mensaje: "Producto eliminado del carrito",
      data: { id: carritoId, items, total },
    });
  } catch (error) {
    next(error);
  }
};

export { obtenerCarrito, agregarItem, actualizarCantidad, eliminarItem };
