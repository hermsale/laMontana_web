// ============================================================================
// Archivo: seguridad.js
// Contexto: Utilidades de hashing y verificación de contraseñas.
// Alcance: Usa bcrypt para generar y validar hashes de contraseñas.
// Funciones exportadas:
//   - hashearPassword(password)
//   - verificarPassword(passwordPlano, passwordGuardada)
// ============================================================================

import bcrypt from "bcrypt";

const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const hashearPassword = async (password) => {
  const salt = await bcrypt.genSalt(ROUNDS);
  return bcrypt.hash(password, salt);
};

const verificarPassword = async (passwordPlano, passwordGuardada) => {
  if (!passwordGuardada) return false;
  return bcrypt.compare(passwordPlano, passwordGuardada);
};

export { hashearPassword, verificarPassword };
