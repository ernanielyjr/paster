import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { closeDatabase } from './database.js';
import { basicAuth } from './middleware/auth.js';
import { isAdmin } from './middleware/isAdmin.js';
import { noCache } from './middleware/noCache.js';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(noCache);
app.use(basicAuth);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/admin', isAdmin, adminRoutes);
app.use('/api', apiRoutes);

process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nEncerrando servidor...');
  closeDatabase();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
