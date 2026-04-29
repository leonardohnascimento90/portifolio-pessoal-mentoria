const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret');

// In-memory users (for simplicity)
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('password', 8) },
];

// Extrai token do header (suporta "Bearer token" ou só "token")
const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) return null;

  const parts = authorizationHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }

  return authorizationHeader;
};

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = getTokenFromHeader(req.headers['authorization']);

  // ✅ sem token → 403
  if (!token) {
    return res.status(403).json({
      autenticado: false,
      message: 'Nenhum token fornecido.',
    });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({
      autenticado: false,
      message: 'JWT_SECRET não configurado.',
    });
  }

  // ✅ token inválido → 401
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        autenticado: false,
        message: 'Falha ao autenticar token.',
      });
    }

    req.userId = decoded.id;
    next();
  });
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // validação de entrada
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username e password são obrigatórios.',
    });
  }

  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      message: 'Credenciais inválidas',
    });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({
      message: 'JWT_SECRET não configurado.',
    });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({
    autenticado: true,
    token,
  });
});

module.exports = { router, verifyToken };