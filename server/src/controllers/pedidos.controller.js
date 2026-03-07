// ============================================================================
// Archivo: pedidos.controller.js
// Contexto: Controlador de pedidos para la API de La Montaña.
// Alcance: Crear pedidos de impresiones/copias asociados a un usuario autenticado,
//          persistiendo datos en tablas normalizadas.
// Métodos exportados:
//   - crearPedido(req, res, next)
// ============================================================================

import crypto from "crypto";
import db from "../../database/db.js";
import { crearError, respuestaExitosa } from "../utils/respuestas.js";

const generarId = () => crypto.randomBytes(10).toString("hex");
const ahora = () => new Date().toISOString();

const selectPedidoById = db.prepare("SELECT * FROM pedidos WHERE id = ? LIMIT 1");
const selectProductoById = db.prepare("SELECT id, nombre, descripcion, categoria FROM productos WHERE id = ? LIMIT 1");
const insertPedidoStmt = db.prepare(`
  INSERT INTO pedidos (
    id, usuarioID, items, archivo, carillas, modo, dobleFaz, encuadernado, anillado, total,
    direccionEnvio, telefonoContacto, notasCliente, metodoPago, estado, historialEstados,
    comprobante, creadoEn, actualizadoEn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertPedidoItemStmt = db.prepare(`
  INSERT INTO pedido_items (
    id, pedidoId, productoId, tipo, nombre, descripcion, categoria, cantidad,
    precioUnitario, subtotal, meta, creadoEn, actualizadoEn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const upsertPedidoArchivoStmt = db.prepare(`
  INSERT INTO pedido_archivos (id, pedidoId, nombre, tipo, tamano, creadoEn, actualizadoEn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(pedidoId)
  DO UPDATE SET
    nombre = excluded.nombre,
    tipo = excluded.tipo,
    tamano = excluded.tamano,
    actualizadoEn = excluded.actualizadoEn
`);
const insertPedidoEstadoStmt = db.prepare(
  "INSERT INTO pedido_estados (id, pedidoId, estado, creadoEn) VALUES (?, ?, ?, ?)"
);
const selectPedidoItemsStmt = db.prepare(
  `SELECT productoId, tipo, nombre, descripcion, categoria, cantidad, precioUnitario, subtotal, meta
   FROM pedido_items WHERE pedidoId = ? ORDER BY creadoEn ASC`
);
const selectPedidoArchivoStmt = db.prepare(
  "SELECT nombre, tipo, tamano FROM pedido_archivos WHERE pedidoId = ? LIMIT 1"
);
const selectPedidoEstadosStmt = db.prepare(
  "SELECT estado FROM pedido_estados WHERE pedidoId = ? ORDER BY creadoEn ASC"
);

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseJsonObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const toBoolInt = (value) => (value ? 1 : 0);

const normalizarItemPedido = (raw) => {
  const productoIdRaw = raw?.productoId || raw?.id;
  const productoIdStr = productoIdRaw ? String(productoIdRaw).trim() : "";
  const producto = productoIdStr ? selectProductoById.get(productoIdStr) : null;

  const cantidad = Math.max(1, Number(raw?.cantidad) || 1);
  const precioUnitario = Math.max(0, Number(raw?.precioUnitario ?? raw?.precio) || 0);
  const subtotal = Math.max(0, Number(raw?.subtotal) || cantidad * precioUnitario);
  const meta = raw?.meta && typeof raw.meta === "object" ? raw.meta : {};

  return {
    productoId: producto ? producto.id : null,
    tipo: raw?.tipo || "producto",
    nombre: raw?.nombre || producto?.nombre || "",
    descripcion: raw?.descripcion || producto?.descripcion || "",
    categoria: raw?.categoria || producto?.categoria || "",
    cantidad,
    precioUnitario,
    subtotal,
    meta,
  };
};

const construirItemServicioImpresion = ({ modo, dobleFaz, encuadernado, anillado, carillas, total }) => {
  const cantidad = Math.max(1, Number(carillas) || 1);
  const totalNum = Math.max(0, Number(total) || 0);
  const precioUnitario = cantidad > 0 ? totalNum / cantidad : totalNum;

  return {
    productoId: null,
    tipo: "servicio",
    nombre: modo === "color" ? "Impresion color" : "Impresion B/N",
    descripcion: "Pedido de impresiones y copias",
    categoria: "impresiones",
    cantidad,
    precioUnitario,
    subtotal: totalNum,
    meta: {
      dobleFaz: !!dobleFaz,
      encuadernado: !!encuadernado,
      anillado: !!anillado,
    },
  };
};

const mapPedidoItemResponse = (row) => {
  const meta = parseJsonObject(row.meta);
  return {
    productoId: row.productoId || undefined,
    tipo: row.tipo || "producto",
    nombre: row.nombre || "",
    descripcion: row.descripcion || "",
    categoria: row.categoria || "",
    cantidad: Number(row.cantidad) || 0,
    precioUnitario: Number(row.precioUnitario) || 0,
    subtotal: Number(row.subtotal) || 0,
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
  };
};

const crearPedido = async (req, res, next) => {
  try {
    const usuarioID = req.user?.uid;
    if (!usuarioID) {
      return next(crearError("No autorizado", 401));
    }

    const {
      archivo,
      carillas,
      modo,
      dobleFaz,
      encuadernado,
      anillado,
      total,
      direccionEnvio,
      telefonoContacto,
      notasCliente,
      metodoPago,
      items,
    } = req.body;

    const id = generarId();
    const ahoraStr = ahora();
    const estadoInicial = "pendiente";

    const normalizedItems = Array.isArray(items)
      ? items.map(normalizarItemPedido)
      : [];

    if (normalizedItems.length === 0) {
      normalizedItems.push(
        construirItemServicioImpresion({
          modo: modo || "bn",
          dobleFaz,
          encuadernado,
          anillado,
          carillas,
          total,
        })
      );
    }

    const archivoObj = archivo && typeof archivo === "object" ? archivo : {};

    const tx = db.transaction(() => {
      insertPedidoStmt.run(
        id,
        usuarioID,
        JSON.stringify(normalizedItems), // legacy compat
        JSON.stringify(archivoObj), // legacy compat
        Number(carillas) || 0,
        modo || "bn",
        toBoolInt(dobleFaz),
        toBoolInt(encuadernado),
        toBoolInt(anillado),
        Math.max(0, Number(total) || 0),
        direccionEnvio || "",
        telefonoContacto || "",
        notasCliente || "",
        metodoPago || "",
        estadoInicial,
        JSON.stringify([estadoInicial]), // legacy compat
        "",
        ahoraStr,
        ahoraStr
      );

      for (const item of normalizedItems) {
        insertPedidoItemStmt.run(
          generarId(),
          id,
          item.productoId,
          item.tipo,
          item.nombre,
          item.descripcion,
          item.categoria,
          item.cantidad,
          item.precioUnitario,
          item.subtotal,
          JSON.stringify(item.meta || {}),
          ahoraStr,
          ahoraStr
        );
      }

      if (archivoObj && (archivoObj.nombre || archivoObj.tipo || archivoObj.tamano)) {
        upsertPedidoArchivoStmt.run(
          generarId(),
          id,
          String(archivoObj.nombre || ""),
          String(archivoObj.tipo || ""),
          Math.max(0, Number(archivoObj.tamano) || 0),
          ahoraStr,
          ahoraStr
        );
      }

      insertPedidoEstadoStmt.run(generarId(), id, estadoInicial, ahoraStr);
    });

    tx();

    const row = selectPedidoById.get(id);
    const itemsRows = selectPedidoItemsStmt.all(id);
    const archivoRow = selectPedidoArchivoStmt.get(id);
    const estadosRows = selectPedidoEstadosStmt.all(id);

    const itemsResponse =
      itemsRows.length > 0 ? itemsRows.map(mapPedidoItemResponse) : parseJsonArray(row.items || "[]");

    const archivoResponse = archivoRow
      ? {
          nombre: archivoRow.nombre || "",
          tipo: archivoRow.tipo || "",
          tamano: Number(archivoRow.tamano) || 0,
        }
      : parseJsonObject(row.archivo || "{}");

    const historialResponse =
      estadosRows.length > 0
        ? estadosRows.map((estadoRow) => estadoRow.estado)
        : parseJsonArray(row.historialEstados || "[]");

    return respuestaExitosa(res, {
      mensaje: "Pedido creado",
      data: {
        id: row.id,
        numeroPedido: row.id,
        usuarioID: row.usuarioID,
        items: itemsResponse,
        archivo: archivoResponse,
        carillas: row.carillas,
        modo: row.modo,
        dobleFaz: !!row.dobleFaz,
        encuadernado: !!row.encuadernado,
        anillado: !!row.anillado,
        total: Number(row.total) || 0,
        direccionEnvio: row.direccionEnvio,
        telefonoContacto: row.telefonoContacto,
        notasCliente: row.notasCliente,
        metodoPago: row.metodoPago,
        estado: row.estado,
        historialEstados: historialResponse,
        comprobante: row.comprobante,
        creadoEn: row.creadoEn,
        actualizadoEn: row.actualizadoEn,
      },
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

export { crearPedido };
