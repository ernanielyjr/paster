import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import { createUser } from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Configurando banco de dados e usuários iniciais...');

initDatabase();

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

if (!Array.isArray(usersList) || usersList.length === 0) {
  console.error('\nERRO: users.json é inválido');
  process.exit(1);
}

for (const user of usersList) {
  if (!user.username || !user.password) {
    console.warn(`AVISO: Ignorando dado inválido: ${JSON.stringify(user)}`);
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

console.log('\nConfiguração concluída!');
process.exit(0);
