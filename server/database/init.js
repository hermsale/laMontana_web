// ============================================================================
// Inicializa la base de datos SQLite creando las tablas.
// Ejecutar: node server/database/init.js
// ============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);
console.log("[sqlite] Tablas creadas correctamente.");
db.close();