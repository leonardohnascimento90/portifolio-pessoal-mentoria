const express = require('express');
const { verifyToken } = require('./auth');
const { getAll, create, remove } = require('../controllers/reservations.controller');
const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas retornada
 *       401:
 *         description: Token de autorização inválido ou ausente
 */
router.get('/', verifyToken, getAll);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Cria uma nova reserva de equipamento
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ferramentaId
 *               - dataInicio
 *               - dataFim
 *             properties:
 *               ferramentaId:
 *                 type: integer
 *                 example: 1
 *               dataInicio:
 *                 type: string
 *                 format: date
 *                 example: '2025-06-01'
 *               dataFim:
 *                 type: string
 *                 format: date
 *                 example: '2025-06-05'
 *     responses:
 *       201:
 *         description: Reserva criada
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token de autorização inválido ou ausente
 */
router.post('/', verifyToken, create);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Remove uma reserva
 *     tags: [Reservas]
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
 *         description: Reserva removida
 *       401:
 *         description: Token de autorização inválido ou ausente
 *       404:
 *         description: Reserva não encontrada
 */
router.delete('/:id', verifyToken, remove);

module.exports = router;