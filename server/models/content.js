import { getDatabase } from '../database.js';

export function getContentByUserId(userId) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT content, updated_at FROM contents WHERE user_id = ?');
  const result = stmt.get(userId);
  return result ? result.content : '';
}

export function saveContent(userId, content) {
  const db = getDatabase();

  // Check if content exists for user
  const existing = db.prepare('SELECT id FROM contents WHERE user_id = ?').get(userId);

  if (existing) {
    const stmt = db.prepare("UPDATE contents SET content = ?, updated_at = datetime('now', 'localtime') WHERE user_id = ?");
    stmt.run(content, userId);
  } else {
    const stmt = db.prepare("INSERT INTO contents (user_id, content, updated_at) VALUES (?, ?, datetime('now', 'localtime'))");
    stmt.run(userId, content);
  }
}
