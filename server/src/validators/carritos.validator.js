// ============================================================================
// Archivo: carritos.validator.js
// Contexto: Validaciones de express-validator para rutas de carritos.
// Alcance: Obtener carrito del usuario autenticado, agregar producto,
//          actualizar cantidad y eliminar producto.
// Funciones exportadas:
//   - validarObtenerCarrito
//   - validarAgregarItem
//   - validarActualizarCantidad
//   - validarEliminarItem
// ============================================================================

import { body, param } from "express-validator";

const validarObtenerCarrito = [];

const validarAgregarItem = [
  body("item.productoId").trim().notEmpty().withMessage("productoId es requerido"),
  body("item.cantidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un entero mayor a 0"),
  body("item.precioUnitario")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("precioUnitario debe ser numérico"),
  body("item.tipo")
    .optional()
    .isIn(["producto"])
    .withMessage("Solo se pueden agregar productos al carrito"),
];

const validarActualizarCantidad = [
  param("carritoId").trim().notEmpty().withMessage("carritoId es requerido"),
  param("productoId").trim().notEmpty().withMessage("productoId es requerido"),
  body("cantidad").isInt({ min: 0 }).withMessage("cantidad debe ser un entero mayor o igual a 0"),
];

const validarEliminarItem = [
  param("carritoId").trim().notEmpty().withMessage("carritoId es requerido"),
  param("productoId").trim().notEmpty().withMessage("productoId es requerido"),
];

export {
  validarObtenerCarrito,
  validarAgregarItem,
  validarActualizarCantidad,
  validarEliminarItem,
};
