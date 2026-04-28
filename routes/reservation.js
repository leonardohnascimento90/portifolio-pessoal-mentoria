const express = require('express');
const { verifyToken } = require('./auth');
const { getAll, create, remove } = require('../controllers/reservations.controller');
const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservations]
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
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toolId
 *               - startDate
 *               - endDate
 *             properties:
 *               toolId:
 *                 type: integer
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2025-06-01'
 *               endDate:
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
 *     tags: [Reservations]
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