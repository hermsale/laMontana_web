// ============================================================================
// Archivo: servicios.controller.js
// Contexto: Controlador de servicios para la API de La Montaña.
// Alcance: Lista servicios disponibles con precios unitarios.
// Métodos exportados:
//   - listarServicios(req, res, next)
// ============================================================================

import db from "../../database/db.js";
import { respuestaExitosa } from "../utils/respuestas.js";

const listarServicios = async (_req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM servicios WHERE disponible = 1").all();
    const servicios = rows.map((r) => ({ id: r.id, ...r }));

    return respuestaExitosa(res, {
      mensaje: "Servicios obtenidos",
      data: servicios,
    });
  } catch (error) {
    next(error);
  }
};

export { listarServicios };