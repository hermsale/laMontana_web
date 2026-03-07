// ============================================================================
// Conexión a SQLite para La Montaña.
// Uso: import db from './database/db.js'
// ============================================================================

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, "lamontana.db");

const db = new Database(dbPath);

// Habilitar modo WAL y enforcement de claves foráneas.
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;
