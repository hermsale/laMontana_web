// ============================================================================
// Archivo: carritos.routes.js
// Contexto: Enrutador de carritos en la API de La Montaña.
// Alcance: Define endpoints para obtener/crear carrito, agregar producto,
//          actualizar cantidad y eliminar producto.
// Rutas:
//   - GET    /api/carritos?usuarioId=...
//   - POST   /api/carritos/items
//   - PATCH  /api/carritos/:carritoId/items/:productoId
//   - DELETE /api/carritos/:carritoId/items/:productoId
// ============================================================================
import { Router } from "express";
import {
  agregarItem,
  actualizarCantidad,
  eliminarItem,
  obtenerCarrito,
} from "../controllers/carritos.controller.js";
import validarCampos from "../middlewares/validarCampos.js";
import authMiddleware from "../middlewares/auth.js";
import {
  validarAgregarItem,
  validarActualizarCantidad,
  validarEliminarItem,
  validarObtenerCarrito,
} from "../validators/carritos.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", validarObtenerCarrito, validarCampos, obtenerCarrito);
router.post("/items", validarAgregarItem, validarCampos, agregarItem);
router.patch(
  "/:carritoId/items/:productoId",
  validarActualizarCantidad,
  validarCampos,
  actualizarCantidad
);
router.delete(
  "/:carritoId/items/:productoId",
  validarEliminarItem,
  validarCampos,
  eliminarItem
);

export default router;
