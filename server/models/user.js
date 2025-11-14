import bcrypt from 'bcryptjs';
import { getDatabase } from '../database.js';

export function getUserByUsername(username) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

export function createUser(username, password, isAdmin = false) {
  const db = getDatabase();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)');
  const result = stmt.run(username, hashedPassword, isAdmin ? 1 : 0);
  return result.lastInsertRowid;
}

export function getAllUsers() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, username, is_admin, created_at FROM users');
  return stmt.all();
}
