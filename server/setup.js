import { getDatabase } from './database.js';
import { createUser, getAllUsers } from './models/user.js';

console.log('Configurando banco de dados...');

const db = getDatabase();

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    last_login_at DATETIME
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT DEFAULT '',
    updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id)
`);

console.log('Tabelas criadas/verificadas com sucesso');

const allUsers = getAllUsers();
const hasAdmin = allUsers.some(user => user.is_admin === 1);

if (!hasAdmin) {
  console.log('Nenhum usuário administrador encontrado. Criando usuário padrão...');
  try {
    createUser('admin', 'admin', true);
    console.log('Usuário criado: admin (admin)');
    console.log('IMPORTANTE: Altere a senha padrão após o primeiro login!');
  } catch (err) {
    console.error('Erro ao criar usuário padrão:', err.message);
    process.exit(1);
  }
} else {
  console.log('Já existe pelo menos um usuário administrador.');
}

console.log('\nConfiguração concluída!');
process.exit(0);
