const express = require('express');
const { verifyToken } = require('./auth');
const { getAll, getById, create, updateStatus } = require('../controllers/tools.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - category
 *         - dailyRate
 *         - weeklyRate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único da ferramenta
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome da ferramenta
 *           example: 'Furadeira / Parafusadeira'
 *         category:
 *           type: string
 *           description: Categoria da ferramenta
 *           example: 'Elétrica'
 *         dailyRate:
 *           type: number
 *           description: Valor de diária (em reais)
 *           example: 50
 *         weeklyRate:
 *           type: number
 *           description: Valor semanal (em reais)
 *           example: 250
 *         status:
 *           type: string
 *           enum:
 *             - available
 *             - unavailable
 *             - maintenance
 *           description: |
 *             Status da ferramenta:
 *             * `available` - Ferramenta disponível para aluguel
 *             * `unavailable` - Ferramenta indisponível (reservada ou problema)
 *             * `maintenance` - Ferramenta em manutenção
 *           example: available
 *     ToolInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - dailyRate
 *         - weeklyRate
 *       properties:
 *         name:
 *           type: string
 *           description: Nome da ferramenta
 *           example: 'Serra de bancada'
 *         category:
 *           type: string
 *           description: Categoria da ferramenta
 *           example: 'Elétrica'
 *         dailyRate:
 *           type: number
 *           description: Valor de diária (em reais, >= 0)
 *           example: 120
 *           minimum: 0
 *         weeklyRate:
 *           type: number
 *           description: Valor semanal (em reais, >= 0)
 *           example: 600
 *           minimum: 0
 *     ToolStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - available
 *             - unavailable
 *             - maintenance
 *           description: |
 *             Novo status da ferramenta:
 *             * `available` - Ferramenta disponível para aluguel
 *             * `unavailable` - Ferramenta indisponível (reservada ou problema)
 *             * `maintenance` - Ferramenta em manutenção
 *           example: maintenance
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *           example: 'Erro na requisição'
 */

/**
 * @swagger
 * /tools:
 *   get:
 *     operationId: listTools
 *     summary: Lista todas as ferramentas
 *     description: Retorna uma lista de todas as ferramentas disponíveis no sistema
 *     tags: [Ferramentas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ferramentas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tool'
 *             examples:
 *               success:
 *                 summary: Exemplo de sucesso
 *                 value:
 *                   - id: 1
 *                     name: 'Furadeira / Parafusadeira'
 *                     category: 'Elétrica'
 *                     dailyRate: 50
 *                     weeklyRate: 250
 *                     status: available
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   message: 'Token não fornecido.'
 */
router.get('/', verifyToken, getAll);

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     operationId: getToolById
 *     summary: Obtém uma ferramenta pelo ID
 *     description: Retorna os detalhes de uma ferramenta específica pelo seu identificador único
 *     tags: [Ferramentas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador da ferramenta
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes da ferramenta retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *             examples:
 *               success:
 *                 value:
 *                   id: 1
 *                   name: 'Furadeira / Parafusadeira'
 *                   category: 'Elétrica'
 *                   dailyRate: 50
 *                   weeklyRate: 250
 *                   status: available
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ferramenta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: 'Ferramenta não encontrada'
 */
router.get('/:id', verifyToken, getById);

/**
 * @swagger
 * /tools:
 *   post:
 *     operationId: createTool
 *     summary: Cadastra uma nova ferramenta
 *     description: Cria um novo registro de ferramenta no sistema com validação de campos obrigatórios e valores numéricos
 *     tags: [Ferramentas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolInput'
 *           examples:
 *             default:
 *               summary: Exemplo de nova ferramenta
 *               value:
 *                 name: 'Serra de bancada'
 *                 category: 'Elétrica'
 *                 dailyRate: 120
 *                 weeklyRate: 600
 *     responses:
 *       201:
 *         description: Ferramenta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *             examples:
 *               created:
 *                 value:
 *                   id: 9
 *                   name: 'Serra de bancada'
 *                   category: 'Elétrica'
 *                   dailyRate: 120
 *                   weeklyRate: 600
 *                   status: available
 *       400:
 *         description: Requisição inválida (campos ausentes ou valores inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidRequest:
 *                 value:
 *                   message: 'Nome e categoria são obrigatórios e devem ser textos não vazios'
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', verifyToken, create);

/**
 * @swagger
 * /tools/{id}/status:
 *   patch:
 *     operationId: updateToolStatus
 *     summary: Atualiza o status de uma ferramenta
 *     description: Modifica o status de uma ferramenta existente com validação de transições permitidas
 *     tags: [Ferramentas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador da ferramenta
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolStatusUpdate'
 *           examples:
 *             maintenance:
 *               summary: Exemplo - colocar em manutenção
 *               value:
 *                 status: maintenance
 *             available:
 *               summary: Exemplo - marcar como disponível
 *               value:
 *                 status: available
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *             examples:
 *               updated:
 *                 value:
 *                   id: 1
 *                   name: 'Furadeira / Parafusadeira'
 *                   category: 'Elétrica'
 *                   dailyRate: 50
 *                   weeklyRate: 250
 *                   status: maintenance
 *       400:
 *         description: Requisição inválida (status inválido, ausente ou transição não permitida)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidStatus:
 *                 value:
 *                   message: 'Status inválido'
 *       401:
 *         description: Token de autorização inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ferramenta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: 'Ferramenta não encontrada'
 */
router.patch('/:id/status', verifyToken, updateStatus);

module.exports = { router };