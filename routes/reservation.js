const express = require('express');
const { verifyToken } = require('./auth');
const { getAll, create, remove } = require('../controllers/reservations.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - id
 *         - toolId
 *         - userId
 *         - startDate
 *         - endDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único da reserva
 *           example: 1
 *         toolId:
 *           type: integer
 *           description: Identificador da ferramenta reservada
 *           example: 1
 *         userId:
 *           type: integer
 *           description: Identificador do usuário que fez a reserva
 *           example: 1
 *         startDate:
 *           type: string
 *           format: date
 *           description: Data de início da reserva
 *           example: '2025-06-01'
 *         endDate:
 *           type: string
 *           format: date
 *           description: Data de término da reserva
 *           example: '2025-06-05'
 *         status:
 *           type: string
 *           enum:
 *             - reserved
 *             - cancelled
 *             - completed
 *           description: Status da reserva
 *           example: reserved
 *     ReservationInput:
 *       type: object
 *       required:
 *         - toolId
 *         - startDate
 *         - endDate
 *       properties:
 *         toolId:
 *           type: integer
 *           description: Identificador da ferramenta a reservar
 *           example: 1
 *         startDate:
 *           type: string
 *           format: date
 *           description: Data de início da reserva (YYYY-MM-DD)
 *           example: '2025-06-01'
 *         endDate:
 *           type: string
 *           format: date
 *           description: Data de término da reserva (YYYY-MM-DD)
 *           example: '2025-06-05'
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *           example: 'Requisição inválida'
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Lista todas as reservas
 *     description: Retorna uma lista completa de todas as reservas registradas no sistema
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *             examples:
 *               success:
 *                 summary: Exemplo de sucesso
 *                 value:
 *                   - id: 1
 *                     toolId: 1
 *                     userId: 1
 *                     startDate: '2025-06-01'
 *                     endDate: '2025-06-05'
 *                     status: reserved
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Exemplo de erro de autenticação
 *                 value:
 *                   message: 'Token não fornecido.'
 */
router.get('/', verifyToken, getAll);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Cria uma nova reserva
 *     description: Cria uma nova reserva de equipamento para o usuário autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *           examples:
 *             default:
 *               summary: Exemplo de entrada padrão
 *               value:
 *                 toolId: 1
 *                 startDate: '2025-06-01'
 *                 endDate: '2025-06-05'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *             examples:
 *               created:
 *                 summary: Exemplo de reserva criada
 *                 value:
 *                   id: 2
 *                   toolId: 1
 *                   userId: 1
 *                   startDate: '2025-06-01'
 *                   endDate: '2025-06-05'
 *                   status: reserved
 *       400:
 *         description: Requisição inválida (campos ausentes, datas inválidas, conflito de data, etc)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidRequest:
 *                 summary: Exemplo de campos ausentes
 *                 value:
 *                   message: 'Campos obrigatórios: toolId, startDate e endDate'
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Exemplo de erro de autenticação
 *                 value:
 *                   message: 'Usuário não autenticado'
 */
router.post('/', verifyToken, create);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Remove uma reserva
 *     description: Deleta uma reserva existente pelo seu ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador da reserva a remover
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Reserva removida com sucesso (sem conteúdo)
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Exemplo de erro de autenticação
 *                 value:
 *                   message: 'Token não fornecido.'
 *       404:
 *         description: Reserva não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 summary: Exemplo de recurso não encontrado
 *                 value:
 *                   message: 'Reserva não encontrada'
 */
router.delete('/:id', verifyToken, remove);


module.exports = router;