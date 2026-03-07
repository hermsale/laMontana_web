// ============================================================================
// Archivo: usuarios.routes.js
// Contexto: Enrutador de usuarios en la API de La Montaña.
// Alcance: Define endpoints para CRUD básico de usuarios (listado, alta, login,
//          obtención por id y actualización).
// Rutas:
//   - GET    /api/usuarios
//   - GET    /api/usuarios/:id
//   - POST   /api/usuarios
//   - POST   /api/usuarios/login
//   - PUT    /api/usuarios/:id
// ============================================================================

import { Router } from "express";
import {
  crearUsuario,
  listarUsuarios,
  loginUsuario,
  loginGoogleUsuario,
  logoutUsuario,
  obtenerUsuario,
  actualizarUsuario,
} from "../controllers/usuarios.controller.js";
import validarCampos from "../middlewares/validarCampos.js";
import authMiddleware from "../middlewares/auth.js";
import {
  validarRegistroUsuario,
  validarLogin,
  validarLoginGoogle,
  validarActualizarUsuario,
} from "../validators/usuarios.validator.js";

const router = Router();

router.post("/", validarRegistroUsuario, validarCampos, crearUsuario);
router.post("/login", validarLogin, validarCampos, loginUsuario);
router.post("/google", validarLoginGoogle, validarCampos, loginGoogleUsuario);
router.post("/logout", logoutUsuario);

router.use(authMiddleware);

router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.put("/:id", validarActualizarUsuario, validarCampos, actualizarUsuario);

export default router;
