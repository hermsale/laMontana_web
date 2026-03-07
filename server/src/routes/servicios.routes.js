// ============================================================================
// Archivo: servicios.routes.js
// Contexto: Rutas para servicios (precio unitario de copias/encuadernados).
// Alcance: Exponer listado de servicios disponibles.
// Rutas:
//   - GET /api/servicios
// ============================================================================
import { Router } from "express";
import { listarServicios } from "../controllers/servicios.controller.js";

const router = Router();

router.get("/", listarServicios);

export default router;
