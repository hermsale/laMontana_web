// ============================================================================
// Archivo: notFound.js
// Contexto: Middleware para rutas inexistentes en la API.
// Alcance: Responde 404 en formato JSON con detalle de método y URL.
// Función exportada:
//   - notFoundHandler(req, res, _next)
// ============================================================================

// Respuesta estándar para rutas inexistentes.
const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    detalle: `${req.method} ${req.originalUrl}`,
  });
};

export default notFoundHandler;
