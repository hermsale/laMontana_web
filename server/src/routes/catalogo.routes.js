// ============================================================================
// Archivo: catalogo.routes.js
// Contexto: Rutas del catálogo (productos y servicios).
// Alcance: Exponer listado combinado desde SQLite.
// Rutas:
//   - GET /api/catalogo
// ============================================================================
import { Router } from "express";
import { listarCatalogo } from "../controllers/catalogo.controller.js";

const router = Router();

router.get("/", listarCatalogo);

export default router;