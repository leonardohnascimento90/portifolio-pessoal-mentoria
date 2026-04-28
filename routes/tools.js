const express = require('express');
const { verifyToken } = require('./auth');
const { getAll, getById, create, updateStatus } = require('../controllers/tools.controller');
const { tools } = require('../utils/data');
const router = express.Router();

/**
 * @swagger
 * /tools:
 *   get:
 *     summary: Lista todas as ferramentas disponíveis
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ferramentas retornada
 *       401:
 *         description: Token de autorização inválido ou ausente
 */
router.get('/', verifyToken, getAll);

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     summary: Retorna uma ferramenta pelo ID
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes da ferramenta
 *       401:
 *         description: Token de autorização inválido ou ausente
 *       404:
 *         description: Ferramenta não encontrada
 */
router.get('/:id', verifyToken, getById);

/**
 * @swagger
 * /tools:
 *   post:
 *     summary: Cadastra uma nova ferramenta
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - dailyRate
 *               - weeklyRate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Serra de bancada
 *               category:
 *                 type: string
 *                 example: Elétrica
 *               dailyRate:
 *                 type: number
 *                 example: 120
 *               weeklyRate:
 *                 type: number
 *                 example: 600
 *     responses:
 *       201:
 *         description: Ferramenta cadastrada
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token de autorização inválido ou ausente
 */
router.post('/', verifyToken, create);

/**
 * @swagger
 * /tools/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma ferramenta
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, maintenance]
 *                 example: maintenance
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token de autorização inválido ou ausente
 *       404:
 *         description: Ferramenta não encontrada
 */
router.patch('/:id/status', verifyToken, updateStatus);

module.exports = { router, tools };