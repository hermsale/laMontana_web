// ============================================================================
// Archivo: pedidos.routes.js
// Contexto: Rutas para pedidos de impresiones/copias.
// Alcance: Crear pedidos asociados al usuario autenticado.
// Rutas:
//   - POST /api/pedidos
// ============================================================================
import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { crearPedido } from "../controllers/pedidos.controller.js";
import { validarCrearPedido } from "../validators/pedidos.validator.js";
import validarCampos from "../middlewares/validarCampos.js";

const router = Router();

router.post("/", authMiddleware, validarCrearPedido, validarCampos, crearPedido);

export default router;
