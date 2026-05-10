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

  const trimmedUsername = typeof username === 'string' ? username.trim() : '';
  if (!trimmedUsername || trimmedUsername.length > 50 || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  try {
    const userId = createUser(trimmedUsername, password, userIsAdmin || false);
    res.status(201).json({ id: userId, username: trimmedUsername, is_admin: userIsAdmin || false });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username já existe' });
    }
    console.error('Erro ao criar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const { password, isAdmin: userIsAdmin } = req.body;

  try {
    updateUser(userId, password, userIsAdmin || false);
    const users = getAllUsers();
    const updatedUser = users.find(u => u.id === userId);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ id: userId, username: updatedUser.username, is_admin: userIsAdmin || false });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'ID inválido' });
  }

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
