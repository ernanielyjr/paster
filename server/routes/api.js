import express from 'express';
import { getContentByUserId, saveContent } from '../models/content.js';

const router = express.Router();

router.get('/content', (req, res) => {
  const user = req.user;
  const content = getContentByUserId(user.id);
  res.json({ username: user.username, content });
});

router.post('/content', (req, res) => {
  const user = req.user;
  const content = req.body.content;

  // Validate content
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Content must be a string' });
  }

  // Log without exposing content
  console.log(`[${user.username}] Content updated (${content.length} chars)`);

  saveContent(user.id, content);
  res.sendStatus(200);
});

export default router;
