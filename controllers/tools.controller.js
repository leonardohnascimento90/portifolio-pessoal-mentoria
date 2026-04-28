const { tools } = require('../utils/data');
const { mapToolToResponse, mapToolsToResponse } = require('../utils/mappers');

const getAll = (req, res) => {
  res.json(mapToolsToResponse(tools));
};

const getById = (req, res) => {
  const item = tools.find(t => t.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Tool not found' });
  res.json(mapToolToResponse(item));
};

const create = (req, res) => {
  const { name, category, dailyRate, weeklyRate } = req.body;
  if (!name || !category || dailyRate == null || weeklyRate == null) {
    return res.status(400).json({ message: 'Missing required fields' });
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
    return res.status(400).json({ message: 'Invalid status' });
  }

  const item = tools.find(t => t.id == req.params.id);
  if (!item) return res.status(404).json({ message: 'Tool not found' });

  item.status = status;
  res.json(mapToolToResponse(item));
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
};