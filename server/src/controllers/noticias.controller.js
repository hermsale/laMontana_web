// ============================================================================
// Archivo: noticias.controller.js
// Contexto: Controlador para noticias y promociones de la landing.
// Alcance: Lee noticias y promociones de SQLite y devuelve lista combinada
//          normalizada para el frontend, priorizando tablas relacionales.
// Métodos exportados:
//   - listarNoticiasYPromos(req, res, next)
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

const toISO = (valor) => {
  if (!valor) return null;
  if (valor instanceof Date) return valor.toISOString();
  if (typeof valor === "string") {
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
  }
  return null;
};

const toDateLabel = (isoString) => {
  if (!isoString) return null;
  const fecha = new Date(isoString);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const normalizarListaCategorias = (categorias = [], fallback) => {
  const list = categorias
    .map((categoria) => String(categoria || "").trim().toLowerCase())
    .filter(Boolean);
  if (list.length > 0) return list;
  return fallback ? [fallback] : [];
};

const obtenerCategoriasRelacionadas = (tipo, id, fallbackCategorias, fallbackCategoriaSingular) => {
  const table = tipo === "promociones" ? "promocion_categorias" : "noticia_categorias";
  const fk = tipo === "promociones" ? "promocionId" : "noticiaId";

  const rows = db
    .prepare(`SELECT categoria FROM ${table} WHERE ${fk} = ?`)
    .all(id);

  const relacionadas = rows.map((row) => row.categoria);
  if (relacionadas.length > 0) {
    return normalizarListaCategorias(relacionadas, tipo);
  }

  const desdeLegacy = parseJsonArray(fallbackCategorias);
  if (desdeLegacy.length > 0) {
    return normalizarListaCategorias(desdeLegacy, tipo);
  }

  if (typeof fallbackCategoriaSingular === "string" && fallbackCategoriaSingular.trim() !== "") {
    return [fallbackCategoriaSingular.trim().toLowerCase()];
  }

  return [tipo];
};

const normalizarPromo = (row) => {
  if (row.disponible === 0) return null;

  const iso = toISO(row.actualizadoEn || row.creadoEn || row.fecha);
  const descuentoRaw = Number(row.descuento);
  const descuento = Number.isFinite(descuentoRaw)
    ? descuentoRaw <= 1
      ? Math.round(descuentoRaw * 100)
      : Math.round(descuentoRaw)
    : null;

  return {
    id: row.id,
    type: "promo",
    label: row.badge || row.etiqueta || "Promocion",
    headline: row.titulo || row.nombre || "Promocion",
    description: row.descripcion || "",
    ratingText: row.ratingText || null,
    dateISO: iso,
    dateLabel: toDateLabel(iso),
    discount: descuento,
    categories: obtenerCategoriasRelacionadas(
      "promociones",
      row.id,
      row.categorias,
      row.categoria
    ),
    ctaText: row.ctaText || "Ver detalle",
    ctaHref: row.ctaHref || "#",
    note: row.nota || row.note || "",
  };
};

const normalizarNoticia = (row) => {
  if (row.disponible === 0) return null;

  const iso = toISO(row.actualizadoEn || row.creadoEn || row.fecha);

  return {
    id: row.id,
    type: "news",
    title: row.titulo || row.nombre || "Noticia",
    description: row.descripcion || "",
    dateISO: iso,
    dateLabel: toDateLabel(iso),
    isNew: Boolean(row.esNueva ?? row.isNew ?? row.reciente),
    categories: obtenerCategoriasRelacionadas("noticias", row.id, row.categorias, row.categoria),
    discount: Number.isFinite(Number(row.descuento)) ? Number(row.descuento) : undefined,
  };
};

const listarNoticiasYPromos = async (_req, res, next) => {
  try {
    const promosRows = db.prepare("SELECT * FROM promociones").all();
    const noticiasRows = db.prepare("SELECT * FROM noticias").all();

    const promos = promosRows.map(normalizarPromo).filter(Boolean);
    const noticias = noticiasRows.map(normalizarNoticia).filter(Boolean);

    return respuestaExitosa(res, {
      mensaje: "Noticias y promociones cargadas",
      data: {
        items: [...promos, ...noticias],
        promociones: promos,
        noticias,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { listarNoticiasYPromos };
