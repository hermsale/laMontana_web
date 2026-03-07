// ============================================================================
// Archivo: index.js
// Contexto: Punto de entrada del servidor Express (API La Montaña).
// Alcance: Inicializa SQLite, configura middlewares, monta rutas y arranca el servidor.
// ============================================================================

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import db from "../database/db.js";
import seedInicial from "../database/seedInicial.js";
import loggerBasico from "./middlewares/logger.js";
import notFoundHandler from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import carritosRouter from "./routes/carritos.routes.js";
import catalogoRouter from "./routes/catalogo.routes.js";
import noticiasRouter from "./routes/noticias.routes.js";
import serviciosRouter from "./routes/servicios.routes.js";
import pedidosRouter from "./routes/pedidos.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../database/schema.sql");

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin Origin (curl/postman) y origins explícitamente permitidos.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(loggerBasico);

app.get("/api/salud", (_req, res) => {
  res.json({ mensaje: "API de La Montana operativa" });
});

app.use("/api/usuarios", usuariosRouter);
app.use("/api/carritos", carritosRouter);
app.use("/api/catalogo", catalogoRouter);
app.use("/api/noticias", noticiasRouter);
app.use("/api/servicios", serviciosRouter);
app.use("/api/pedidos", pedidosRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const arrancar = async () => {
  try {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schema);
    await seedInicial();

    app.listen(PORT, () => {
      console.log(`Servidor API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor", error);
    process.exit(1);
  }
};

arrancar();
