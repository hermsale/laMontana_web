// ============================================================================
// Archivo: errorHandler.js
// Contexto: Middleware global de manejo de errores para la API.
// Alcance: Captura errores propagados y responde siempre en JSON.
// Función exportada:
//   - errorHandler(err, req, res, _next)
// ============================================================================

// Manejo centralizado de errores para responder siempre en JSON.
const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const payload = {
    error: err.message || "Error interno del servidor",
  };

  if (err.detalles) {
    payload.detalles = err.detalles;
  }

  console.error(err);
  res.status(status).json(payload);
};

export default errorHandler;
