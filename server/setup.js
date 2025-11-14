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

let usersData;
try {
  const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
  usersData = JSON.parse(fileContent);
} catch (err) {
  console.error('\nERRO: Falha ao ler ou processar users.json');
  console.error(err.message);
  process.exit(1);
}

// Validate format: { "username": "password" }
if (typeof usersData !== 'object' || usersData === null || Array.isArray(usersData)) {
  console.error('\nERRO: users.json deve ser um objeto no formato: { "username": "password" }');
  process.exit(1);
}

// Convert object to array of users
const usersList = Object.entries(usersData).map(([username, password]) => ({
  username,
  password: String(password)
}));

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
    createUser(user.username, user.password);
    console.log(`Usuário criado: ${user.username}`);
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
