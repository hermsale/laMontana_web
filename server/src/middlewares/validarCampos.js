// ============================================================================
// Archivo: validarCampos.js
// Contexto: Middleware para unificar la validación de express-validator.
// Alcance: Convierte errores de validación en un formato JSON uniforme.
// Función exportada:
//   - validarCampos(req, _res, next)
// ============================================================================

import { validationResult } from "express-validator";
import { crearError } from "../utils/respuestas.js";

// Valida los resultados de express-validator y unifica el formato de error.
const validarCampos = (req, _res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const detalles = errores.array().map((err) => ({
      campo: err.path,
      mensaje: err.msg,
    }));
    return next(crearError("Datos inválidos", 400, detalles));
  }

  next();
};

export default validarCampos;
