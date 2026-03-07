// ============================================================================
// Archivo: usuarios.validator.js
// Contexto: Validaciones de express-validator para rutas de usuarios.
// Alcance: Registro, login y actualización de perfil.
// Funciones exportadas:
//   - validarRegistroUsuario
//   - validarLogin
//   - validarActualizarUsuario
// ============================================================================

import { body, param } from "express-validator";

const validarRegistroUsuario = [
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
  body("email").trim().isEmail().withMessage("El correo electrónico no es válido"),
  body("telefono").optional().trim(),
  body("direccion").optional().trim(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

const validarLogin = [
  body("email").trim().isEmail().withMessage("El correo electrónico no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

const validarLoginGoogle = [
  body("idToken")
    .trim()
    .notEmpty()
    .withMessage("idToken de Google es obligatorio"),
];

const validarActualizarUsuario = [
  param("id").trim().notEmpty().withMessage("El id es requerido"),
  body("email").optional().trim().isEmail().withMessage("El correo electrónico no es válido"),
  body("telefono").optional().trim(),
  body("direccion").optional().trim(),
  body("passwordNueva")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

export { validarRegistroUsuario, validarLogin, validarLoginGoogle, validarActualizarUsuario };
