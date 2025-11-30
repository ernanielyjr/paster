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
  const stmt = db.prepare(`
    SELECT
      u.id,
      u.username,
      u.is_admin,
      u.created_at,
      u.last_login_at,
      c.updated_at as content_updated_at
    FROM users u
    LEFT JOIN contents c ON u.id = c.user_id
  `);
  return stmt.all();
}

export function updateLastLogin(userId) {
  const db = getDatabase();
  const stmt = db.prepare("UPDATE users SET last_login_at = datetime('now', 'localtime') WHERE id = ?");
  stmt.run(userId);
}

export function updateUser(userId, password, isAdmin) {
  const db = getDatabase();
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('UPDATE users SET password = ?, is_admin = ? WHERE id = ?');
    stmt.run(hashedPassword, isAdmin ? 1 : 0, userId);
  } else {
    const stmt = db.prepare('UPDATE users SET is_admin = ? WHERE id = ?');
    stmt.run(isAdmin ? 1 : 0, userId);
  }
}

export function deleteUser(userId) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(userId);
}
