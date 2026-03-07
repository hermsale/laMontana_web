// ============================================================================
// Archivo: auth.js
// Contexto: Middleware de autenticación para la API.
// Alcance:
//   - Lee el header Authorization: Bearer <token>.
//   - Verifica el JWT con JWT_SECRET y adjunta req.user: { uid, email, claims }.
// ============================================================================

import { verifyToken } from "../utils/jwt.js";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";

const extractBearerToken = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const authMiddleware = async (req, res, next) => {
  const token = extractBearerToken(req) || req.cookies?.[AUTH_COOKIE_NAME] || null;
  if (!token) {
    return res.status(401).json({ error: "Falta token de autorización" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded?.uid) {
      throw new Error("Token sin uid");
    }
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      claims: decoded,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authMiddleware;
