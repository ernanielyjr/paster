import express from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../models/user.js';

const router = express.Router();

router.get('/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.post('/users', (req, res) => {
  const { username, password, isAdmin: userIsAdmin } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  try {
    const userId = createUser(username, password, userIsAdmin || false);
    res.status(201).json({ id: userId, username, is_admin: userIsAdmin || false });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username já existe' });
    }
    console.error('Erro ao criar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password, isAdmin: userIsAdmin } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório' });
  }

  try {
    updateUser(userId, username, password, userIsAdmin || false);
    res.json({ id: userId, username, is_admin: userIsAdmin || false });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username já existe' });
    }
    console.error('Erro ao atualizar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Não é possível deletar seu próprio usuário' });
  }

  try {
    deleteUser(userId);
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
