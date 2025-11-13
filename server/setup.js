import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import { createUser } from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up database and initial users...');

initDatabase();

// Load users from JSON file
const usersFilePath = path.join(__dirname, '..', 'users.json');

if (!fs.existsSync(usersFilePath)) {
  console.error('\n❌ ERROR: users.json not found!');
  process.exit(1);
}

let usersData;
try {
  const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
  usersData = JSON.parse(fileContent);
} catch (err) {
  console.error('\n❌ ERROR: Failed to read or parse users.json');
  console.error(err.message);
  process.exit(1);
}

// Validate format: { "username": "password" }
if (typeof usersData !== 'object' || usersData === null || Array.isArray(usersData)) {
  console.error('\n❌ ERROR: users.json must be an object with format: { "username": "password" }');
  process.exit(1);
}

// Convert object to array of users
const usersList = Object.entries(usersData).map(([username, password]) => ({
  username,
  password: String(password)
}));

if (usersList.length === 0) {
  console.error('\n❌ ERROR: users.json must contain at least one user');
  process.exit(1);
}

// Create users
for (const user of usersList) {
  if (!user.username || !user.password) {
    console.warn(`⚠ Skipping invalid user entry: ${JSON.stringify(user)}`);
    continue;
  }

  try {
    createUser(user.username, user.password);
    console.log(`✓ User created: ${user.username}`);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log(`ℹ User already exists: ${user.username}`);
    } else {
      console.error(`✗ Error creating user ${user.username}:`, err.message);
    }
  }
}

console.log('\nSetup complete! You can now start the server with: npm start');
process.exit(0);
