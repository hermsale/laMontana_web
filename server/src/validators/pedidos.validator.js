// ============================================================================
// Archivo: pedidos.validator.js
// Contexto: Validaciones de express-validator para pedidos.
// Alcance: Crear pedido de impresiones/copias.
// Funciones exportadas:
//   - validarCrearPedido
// ============================================================================

import { body } from "express-validator";

const validarCrearPedido = [
  body("carillas").optional().isInt({ min: 1 }).withMessage("carillas debe ser un entero >=1"),
  body("modo").optional().isIn(["bn", "color"]).withMessage("modo debe ser bn o color"),
  body("total").optional().isFloat({ min: 0 }).withMessage("total debe ser numérico"),
  body("archivo")
    .optional()
    .isObject()
    .withMessage("archivo debe ser un objeto con nombre/tipo/tamano si se envía"),
  body("metodoPago").optional().isString().withMessage("metodoPago debe ser texto"),
];

export { validarCrearPedido };
