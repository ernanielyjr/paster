import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { users } from './users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = 'data.json';

let userContents = {};

// Load data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      userContents = JSON.parse(data);
      console.log('Data loaded from file');
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(userContents, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

loadData();

// Limit request body size to prevent DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
    return res.status(401).send('Autenticação necessária');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Use constant-time comparison to prevent timing attacks
  if (users[username]) {
    const expectedPassword = Buffer.from(users[username]);
    const providedPassword = Buffer.from(password);
    
    if (expectedPassword.length === providedPassword.length && 
        crypto.timingSafeEqual(expectedPassword, providedPassword)) {
      req.user = username;
      return next();
    }
  }
  
  res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
  return res.status(401).send('Credenciais inválidas');
}

// Disable cache
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use(basicAuth);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/content', (req, res) => {
  const username = req.user;
  const content = userContents[username] || '';
  res.json({ username, content });
});

app.post('/api/content', (req, res) => {
  const username = req.user;
  const content = req.body.content;

  // Validate content
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Content must be a string' });
  }

  // Log without exposing content
  console.log(`[${username}] Content updated (${content.length} chars)`);
  
  userContents[username] = content;
  saveData();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
