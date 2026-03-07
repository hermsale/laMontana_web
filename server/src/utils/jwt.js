// ============================================================================
// Archivo: jwt.js
// Contexto: Utilidades para firmar y verificar JWT (sesiones, autenticación).
// Alcance:
//   - signToken(payload, options): firma un JWT con JWT_SECRET.
//   - verifyToken(token): verifica y devuelve el payload.
// Requiere: JWT_SECRET en variables de entorno.
// ============================================================================

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXP || "2h";

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno.");
}

const signToken = (payload, options = {}) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP, ...options });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export { signToken, verifyToken };