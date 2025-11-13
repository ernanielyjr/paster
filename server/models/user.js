import { getDatabase } from '../database.js';

export function getUserByUsername(username) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

export function createUser(username, password) {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const result = stmt.run(username, password);
  return result.lastInsertRowid;
}

export function getAllUsers() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, username, created_at FROM users');
  return stmt.all();
}
