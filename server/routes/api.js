import express from 'express';
import { getContentByUserId, saveContent } from '../models/content.js';

const router = express.Router();

router.get('/content', (req, res) => {
  const user = req.user;
  const content = getContentByUserId(user.id);
  res.json({ username: user.username, content, isAdmin: user.is_admin === 1 });
});

router.post('/content', (req, res) => {
  const user = req.user;
  const content = req.body.content;

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Conteúdo deve ser uma string' });
  }

  console.log(`[${user.username}] Conteúdo atualizado (${content.length} caracteres)`);

  saveContent(user.id, content);
  res.sendStatus(200);
});

export default router;
