// ============================================================================
// Archivo: logger.js
// Contexto: Middleware simple para registrar solicitudes entrantes.
// Alcance: Agrega trazas en consola con método y URL.
// Función exportada:
//   - loggerBasico(req, res, next)
// ============================================================================

// Middleware propio para dejar trazas simples en consola.
const loggerBasico = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

export default loggerBasico;
