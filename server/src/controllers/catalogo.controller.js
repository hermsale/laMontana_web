// ============================================================================
// Archivo: catalogo.controller.js
// Contexto: Controlador de catálogo para la API de La Montaña.
// Alcance: Lee productos, servicios y promociones de SQLite y los devuelve
//          normalizados para el frontend, priorizando tablas relacionales.
// Métodos exportados:
//   - listarCatalogo(req, res, next)
// ============================================================================

import db from "../../database/db.js";
import { respuestaExitosa } from "../utils/respuestas.js";

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

const normalizarDescuento = (valor) => {
  const descuento = Number(valor);
  if (!Number.isFinite(descuento) || descuento <= 0) return null;
  return Math.min(Math.max(descuento <= 1 ? descuento : descuento / 100, 0), 1);
};

const obtenerCategoriasPromocion = (promocionId) => {
  const categoriasRows = db
    .prepare("SELECT categoria FROM promocion_categorias WHERE promocionId = ?")
    .all(promocionId);

  const categoriasNorm = categoriasRows
    .map((row) => String(row.categoria || "").trim().toLowerCase())
    .filter(Boolean);

  if (categoriasNorm.length > 0) return categoriasNorm;

  const promo = db.prepare("SELECT categorias FROM promociones WHERE id = ? LIMIT 1").get(promocionId);
  return parseJsonArray(promo?.categorias)
    .map((categoria) => String(categoria || "").trim().toLowerCase())
    .filter(Boolean);
};

const obtenerPromocionesDisponibles = () => {
  const rows = db.prepare("SELECT * FROM promociones WHERE disponible = 1").all();
  return rows.map((row) => ({
    id: row.id,
    nombre: row.nombre || row.descripcion || "Promoción",
    descuento: normalizarDescuento(row.descuento),
    categorias: obtenerCategoriasPromocion(row.id),
  }));
};

const mapPromoResponse = (promo) => {
  if (!promo || promo.descuento == null) return null;
  return {
    nombre: promo.nombre || "Promoción",
    descuento: promo.descuento,
  };
};

const resolverPromo = (row, promociones) => {
  const directId = row.promocionId || row.promocion || row.promoId || null;
  if (directId) {
    const promo = promociones.find((p) => p.id === directId);
    const resolved = mapPromoResponse(promo);
    if (resolved) return resolved;
  }

  const categoria = String(row.categoria || "").trim().toLowerCase();
  if (!categoria) return null;

  const promoPorCategoria = promociones
    .filter((promo) => Array.isArray(promo.categorias) && promo.categorias.includes(categoria))
    .sort((a, b) => (b.descuento || 0) - (a.descuento || 0))[0];

  return mapPromoResponse(promoPorCategoria);
};

const obtenerMapaImagenes = () => {
  const rows = db
    .prepare(
      `SELECT productoId, url
       FROM producto_imagenes
       ORDER BY productoId ASC, orden ASC, creadoEn ASC`
    )
    .all();

  const mapa = new Map();
  rows.forEach((row) => {
    if (!row.productoId || !row.url) return;
    if (!mapa.has(row.productoId)) {
      mapa.set(row.productoId, row.url);
    }
  });

  return mapa;
};

const normalizarItem = (row, tipo, promociones, imagenesPorProducto) => {
  const disponible = row.disponible !== 0;
  if (!disponible) return null;

  let imagen = "";
  if (tipo === "producto") {
    imagen = imagenesPorProducto.get(row.id) || "";
    if (!imagen) {
      const imagenesLegacy = parseJsonArray(row.imagenes);
      imagen = imagenesLegacy.find((url) => typeof url === "string" && url.trim() !== "") || "";
    }
  }

  return {
    id: row.id,
    tipo,
    nombre: row.nombre || "",
    descripcion: row.descripcion || "",
    categoria: row.categoria || (tipo === "servicio" ? "servicios" : "productos"),
    precio: Number(row.precio) || 0,
    promo: resolverPromo(row, promociones),
    imagen,
  };
};

const listarCatalogo = async (_req, res, next) => {
  try {
    const promociones = obtenerPromocionesDisponibles();
    const imagenesPorProducto = obtenerMapaImagenes();
    const productosRows = db.prepare("SELECT * FROM productos").all();
    const serviciosRows = db.prepare("SELECT * FROM servicios").all();

    const productos = productosRows
      .map((row) => normalizarItem(row, "producto", promociones, imagenesPorProducto))
      .filter(Boolean);

    const servicios = serviciosRows
      .map((row) => normalizarItem(row, "servicio", promociones, imagenesPorProducto))
      .filter(Boolean);

    return respuestaExitosa(res, {
      mensaje: "Catálogo cargado",
      data: {
        items: [...productos, ...servicios],
        productos,
        servicios,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { listarCatalogo };
