import bcrypt from 'bcryptjs';
import { getUserByUsername, updateLastLogin } from '../models/user.js';

export function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
    return res.status(401).send('Autenticação necessária');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const {password: hashedPassword = "", ...userWithoutPassword} = getUserByUsername(username) || {};

  if (bcrypt.compareSync(password, hashedPassword) && hashedPassword && userWithoutPassword) {
    updateLastLogin(userWithoutPassword.id);
    req.user = userWithoutPassword;
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
  return res.status(401).send('Credenciais inválidas');
}
