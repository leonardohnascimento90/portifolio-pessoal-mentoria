const { tools } = require('../utils/data');
const { mapToolToResponse, mapToolsToResponse, normalizeToolInput } = require('../utils/mappers');

const getAll = (req, res) => {
  res.json(mapToolsToResponse(tools));
};

const getById = (req, res) => {
  const item = tools.find(t => t.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Ferramenta não encontrada' });
  res.json(mapToolToResponse(item));
};

const create = (req, res) => {
  const normalized = normalizeToolInput(req.body);
  const { name, category, dailyRate, weeklyRate } = normalized;
  if (!name || !category || dailyRate == null || weeklyRate == null) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
  }

  const id = tools.length + 1;
  const newTool = {
    id,
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
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  const item = tools.find(t => t.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Ferramenta não encontrada' });
  res.json(mapToolToResponse(item));
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
};