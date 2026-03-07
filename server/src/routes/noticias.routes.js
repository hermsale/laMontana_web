// ============================================================================
// Archivo: noticias.routes.js
// Contexto: Rutas para noticias y promociones de la landing.
// Alcance: Exponer listado combinado desde SQLite.
// Rutas:
//   - GET /api/noticias
// ============================================================================
import { Router } from "express";
import { listarNoticiasYPromos } from "../controllers/noticias.controller.js";

const router = Router();

router.get("/", listarNoticiasYPromos);

export default router;