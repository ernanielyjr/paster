import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'paster.db');
const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');

export function getDatabase() {
  return db;
}

export function closeDatabase() {
  db.close();
}
