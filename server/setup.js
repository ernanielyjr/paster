import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import { createUser } from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Configurando banco de dados e usuários iniciais...');

initDatabase();

// Load users from JSON file
const usersFilePath = path.join(__dirname, '..', 'users.json');

if (!fs.existsSync(usersFilePath)) {
  console.error('\nERRO: arquivo users.json não encontrado!');
  process.exit(1);
}

let usersList;
try {
  const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
  usersList = JSON.parse(fileContent);
} catch (err) {
  console.error('\nERRO: Falha ao ler ou processar users.json');
  console.error(err.message);
  process.exit(1);
}

// Validate format: array of { username, password, isAdmin? }
if (!Array.isArray(usersList)) {
  console.error('\nERRO: users.json deve ser um array no formato: [{ "username": "user", "password": "pass", "isAdmin": true }]');
  process.exit(1);
}

if (usersList.length === 0) {
  console.error('\nERRO: users.json deve conter ao menos um usuário');
  process.exit(1);
}

// Create users
for (const user of usersList) {
  if (!user.username || !user.password) {
    console.warn(`AVISO: Ignorando entrada de usuário inválida: ${JSON.stringify(user)}`);
    continue;
  }

  try {
    createUser(user.username, user.password, user.isAdmin || false);
    const adminLabel = user.isAdmin ? ' (admin)' : '';
    console.log(`Usuário criado: ${user.username}${adminLabel}`);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log(`Usuário já existe: ${user.username}`);
    } else {
      console.error(`Erro ao criar usuário ${user.username}:`, err.message);
    }
  }
}

console.log('\nConfiguração concluída! Você pode iniciar o servidor com: npm start');
process.exit(0);
