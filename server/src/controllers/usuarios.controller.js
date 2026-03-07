// ============================================================================
// Archivo: usuarios.controller.js
// Contexto: Controlador de usuarios para la API de La Montaña.
// Alcance: CRUD de usuarios en SQLite; registro y login con bcrypt + JWT.
// Métodos exportados:
//   - crearUsuario, loginUsuario, listarUsuarios, obtenerUsuario, actualizarUsuario
// ============================================================================

import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import db from "../../database/db.js";
import { respuestaExitosa, crearError } from "../utils/respuestas.js";
import { hashearPassword, verificarPassword } from "../utils/seguridad.js";
import { signToken } from "../utils/jwt.js";

const generarId = () => crypto.randomBytes(10).toString("hex");
const ahora = () => new Date().toISOString();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";
const AUTH_COOKIE_MAX_AGE_MS = Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || 1000 * 60 * 60 * 2;

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: "/",
};

const omitirPassword = (u) => {
  const { passwordHash, password, ...rest } = u;
  return rest;
};

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions, maxAge: undefined });
};

const normalizarNombreGoogle = (payload) => {
  const nombre = (payload?.given_name || "").trim();
  const apellido = (payload?.family_name || "").trim();

  if (nombre || apellido) {
    return {
      nombre: nombre || "Usuario",
      apellido: apellido || "",
    };
  }

  const fullName = (payload?.name || "").trim();
  if (!fullName) {
    return { nombre: "Usuario", apellido: "" };
  }

  const [first, ...rest] = fullName.split(" ");
  return {
    nombre: first || "Usuario",
    apellido: rest.join(" ").trim(),
  };
};

const crearUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono, direccion, password } = req.body;

    const existente = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(email);
    if (existente) {
      return next(crearError("El correo ya está registrado", 409));
    }

    const id = generarId();
    const passwordHash = await hashearPassword(password);
    const ahoraStr = ahora();

    db.prepare(
      `INSERT INTO usuarios (id, uid, nombre, apellido, email, telefono, direccion, passwordHash, creadoEn, actualizadoEn)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, id, nombre, apellido, email, telefono || "", direccion || "", passwordHash, ahoraStr, ahoraStr);

    const row = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
    const usuarioPlano = omitirPassword({ id: row.id, uid: row.uid, ...row });

    const token = signToken({ uid: id, email });
    setAuthCookie(res, token);

    return respuestaExitosa(res, {
      mensaje: "Usuario creado con éxito",
      data: { usuario: usuarioPlano },
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const row = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
    if (!row) {
      return next(crearError("Credenciales inválidas", 401));
    }

    let passwordHash = row.passwordHash;
    let passwordOk = await verificarPassword(password, passwordHash);

    if (!passwordOk && (row.password === password || passwordHash === password)) {
      passwordOk = true;
    }
    if (!passwordOk) {
      return next(crearError("Credenciales inválidas", 401));
    }

    if (!passwordHash || passwordHash === password || row.password === password) {
      passwordHash = await hashearPassword(password);
      const ahoraStr = ahora();
      db.prepare("UPDATE usuarios SET passwordHash = ?, actualizadoEn = ? WHERE id = ?").run(
        passwordHash,
        ahoraStr,
        row.id
      );
    }

    const uid = row.uid || row.id;
    const usuarioPlano = omitirPassword({ id: uid, uid, ...row });

    const token = signToken({ uid, email: usuarioPlano.email });
    setAuthCookie(res, token);

    return respuestaExitosa(res, {
      mensaje: "Login exitoso",
      data: { usuario: usuarioPlano },
    });
  } catch (error) {
    next(error);
  }
};

const loginGoogleUsuario = async (req, res, next) => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return next(
        crearError(
          "Login con Google no configurado en el servidor. Define GOOGLE_CLIENT_ID en .env",
          503
        )
      );
    }

    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.email_verified) {
      return next(crearError("Token de Google inválido", 401));
    }
    if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss || "")) {
      return next(crearError("Emisor de Google inválido", 401));
    }

    const email = String(payload.email).toLowerCase().trim();
    const googleSub = String(payload.sub || "").trim();
    const { nombre, apellido } = normalizarNombreGoogle(payload);
    const ahoraStr = ahora();

    let row = db.prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1").get(email);
    let creado = false;

    if (!row) {
      const id = generarId();
      const passwordTemporal = crypto.randomBytes(24).toString("hex");
      const passwordHash = await hashearPassword(passwordTemporal);

      db.prepare(
        `INSERT INTO usuarios (id, uid, nombre, apellido, email, telefono, direccion, passwordHash, creadoEn, actualizadoEn)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        googleSub || id,
        nombre,
        apellido,
        email,
        "",
        "",
        passwordHash,
        ahoraStr,
        ahoraStr
      );

      row = db.prepare("SELECT * FROM usuarios WHERE id = ? LIMIT 1").get(id);
      creado = true;
    } else {
      const uidActual = row.uid || row.id;
      const uidNuevo = googleSub || uidActual;
      const nombreActual = row.nombre || nombre;
      const apellidoActual = row.apellido || apellido;

      db.prepare(
        `UPDATE usuarios
         SET uid = ?, nombre = ?, apellido = ?, actualizadoEn = ?
         WHERE id = ?`
      ).run(uidNuevo, nombreActual, apellidoActual, ahoraStr, row.id);

      row = db.prepare("SELECT * FROM usuarios WHERE id = ? LIMIT 1").get(row.id);
    }

    const uid = row.uid || row.id;
    const usuarioPlano = omitirPassword({ ...row, id: row.id, uid });
    const token = signToken({ uid, email: usuarioPlano.email });
    setAuthCookie(res, token);

    return respuestaExitosa(res, {
      mensaje: creado ? "Cuenta creada con Google" : "Login con Google exitoso",
      data: { usuario: usuarioPlano },
    });
  } catch (error) {
    return next(crearError("No se pudo validar el token de Google", 401));
  }
};

const logoutUsuario = async (_req, res, next) => {
  try {
    clearAuthCookie(res);
    return respuestaExitosa(res, {
      mensaje: "Sesión cerrada",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

const listarUsuarios = async (_req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM usuarios").all();
    const usuarios = rows.map((r) => omitirPassword({ id: r.id, ...r }));

    return respuestaExitosa(res, {
      mensaje: "Usuarios obtenidos",
      data: usuarios,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.uid !== id) {
      return next(crearError("No autorizado", 403));
    }

    const row = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
    if (!row) {
      return next(crearError("Usuario no encontrado", 404));
    }

    const usuario = omitirPassword({ id: row.id, ...row });
    return respuestaExitosa(res, { data: usuario, mensaje: "Usuario obtenido" });
  } catch (error) {
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.uid !== id) {
      return next(crearError("No autorizado", 403));
    }
    const { nombre, apellido, telefono, direccion, email, passwordActual, passwordNueva } =
      req.body;

    const row = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
    if (!row) {
      return next(crearError("Usuario no encontrado", 404));
    }

    if (email && email !== row.email) {
      const existente = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(email);
      if (existente) {
        return next(crearError("El correo ya está registrado", 409));
      }
    }

    let passwordHash = row.passwordHash;
    if (passwordNueva) {
      const valida = await verificarPassword(passwordActual || "", row.passwordHash);
      if (!valida) {
        return next(crearError("La contraseña actual no es correcta", 401));
      }
      passwordHash = await hashearPassword(passwordNueva);
    }

    const ahoraStr = ahora();
    db.prepare(
      `UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, email = ?, passwordHash = ?, actualizadoEn = ?
       WHERE id = ?`
    ).run(
      nombre ?? row.nombre,
      apellido ?? row.apellido,
      telefono ?? row.telefono,
      direccion ?? row.direccion,
      email ?? row.email,
      passwordHash,
      ahoraStr,
      id
    );

    const actualizado = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
    const usuario = omitirPassword({ id: actualizado.id, ...actualizado });

    return respuestaExitosa(res, {
      mensaje: "Usuario actualizado",
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

export {
  crearUsuario,
  loginUsuario,
  loginGoogleUsuario,
  logoutUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
};
