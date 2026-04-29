const { tools } = require('../utils/data');
const { mapToolToResponse, mapToolsToResponse, normalizeToolInput } = require('../utils/mappers');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

const isValidId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
};

const getNextToolId = () => {
  const highestId = tools.reduce((maxId, tool) => Math.max(maxId, tool.id), 0);
  return highestId + 1;
};

const canUpdateStatus = (currentStatus, nextStatus) => {
  if (currentStatus === 'maintenance' && nextStatus === 'unavailable') {
    return false;
  }

  return ['available', 'unavailable', 'maintenance'].includes(currentStatus)
    && ['available', 'unavailable', 'maintenance'].includes(nextStatus);
};

const getAll = (req, res) => {
  res.json(mapToolsToResponse(tools));
};

const getById = (req, res) => {
  const toolId = Number(req.params.id);
  if (Number.isNaN(toolId)) {
    return res.status(400).json({ message: 'ID de ferramenta inválido' });
  }

  const item = tools.find((t) => t.id === toolId);
  if (!item) return res.status(404).json({ message: 'Ferramenta não encontrada' });
  res.json(mapToolToResponse(item));
};

const create = (req, res) => {
  const normalized = normalizeToolInput(req.body);
  const { name, category, dailyRate, weeklyRate } = normalized;

  if (!isNonEmptyString(name) || !isNonEmptyString(category)) {
    return res.status(400).json({ message: 'Nome e categoria são obrigatórios e devem ser textos não vazios' });
  }

  if (dailyRate == null || weeklyRate == null) {
    return res.status(400).json({ message: 'Valores de diária e semanal são obrigatórios' });
  }

  if (typeof dailyRate !== 'number' || dailyRate < 0 || typeof weeklyRate !== 'number' || weeklyRate < 0) {
    return res.status(400).json({ message: 'Valores de diária e semanal devem ser números maiores ou iguais a zero' });
  }

  const newTool = {
    id: getNextToolId(),
    name,
    category,
    dailyRate,
    weeklyRate,
    status: 'available',
  };

  tools.push(newTool);
  res.status(201).json(mapToolToResponse(newTool));
};

const updateStatus = (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'unavailable', 'maintenance'];

  if (!isNonEmptyString(status)) {
    return res.status(400).json({ message: 'Campo status é obrigatório e deve ser um texto não vazio' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  const toolId = req.params.id;
  if (!isValidId(toolId)) {
    return res.status(400).json({ message: 'ID de ferramenta inválido' });
  }

  const numericToolId = Number(toolId);
  const item = tools.find((t) => t.id === numericToolId);
  if (!item) return res.status(404).json({ message: 'Ferramenta não encontrada' });

  if (!canUpdateStatus(item.status, status)) {
    return res.status(400).json({ message: 'Transição de status inválida' });
  }

  item.status = status;
  res.json(mapToolToResponse(item));
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
};