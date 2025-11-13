import crypto from 'crypto';
import { getUserByUsername } from './models/user.js';

export function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
    return res.status(401).send('Autenticação necessária');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Get user from database
  const user = getUserByUsername(username);

  if (user) {
    const expectedPassword = Buffer.from(user.password);
    const providedPassword = Buffer.from(password);

    // Use constant-time comparison to prevent timing attacks
    if (expectedPassword.length === providedPassword.length &&
        crypto.timingSafeEqual(expectedPassword, providedPassword)) {
      req.user = user;
      return next();
    }
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Paster"');
  return res.status(401).send('Credenciais inválidas');
}
