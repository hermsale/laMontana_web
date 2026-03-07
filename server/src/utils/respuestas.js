// ============================================================================
// Archivo: respuestas.js
// Contexto: Helpers para generar respuestas y errores uniformes en la API.
// Alcance: Se usa en controladores y middlewares para mantener formato JSON.
// Funciones exportadas:
//   - respuestaExitosa(res, { data, mensaje, status })
//   - crearError(mensaje, statusCode, detalles)
// ============================================================================

// Helpers para responder de forma consistente.
const respuestaExitosa = (res, { data = null, mensaje = "Operación exitosa", status = 200 }) => {
  return res.status(status).json({ mensaje, data });
};

const crearError = (mensaje, statusCode = 400, detalles) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  if (detalles) {
    error.detalles = detalles;
  }
  return error;
};

export { respuestaExitosa, crearError };
