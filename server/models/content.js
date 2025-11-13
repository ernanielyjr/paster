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
    // Update existing content
    const stmt = db.prepare('UPDATE contents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?');
    stmt.run(content, userId);
  } else {
    // Insert new content
    const stmt = db.prepare('INSERT INTO contents (user_id, content) VALUES (?, ?)');
    stmt.run(userId, content);
  }
}
