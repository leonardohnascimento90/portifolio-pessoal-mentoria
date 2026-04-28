const { tools, reservations } = require('../utils/data');
const { mapReservationsToResponse, mapReservationToResponse, normalizeReservationInput } = require('../utils/mappers');

const parseDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const hasConflict = (startA, endA, startB, endB) => {
  return startA <= endB && startB <= endA;
};

const isActiveReservation = (reservation) => {
  const today = new Date();
  const start = parseDate(reservation.startDate);
  const end = parseDate(reservation.endDate);
  return start && end && start <= today && today <= end;
};

const syncToolStatus = (toolId) => {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return;

  const hasActive = reservations.some(r => r.toolId === toolId && isActiveReservation(r));
  tool.status = hasActive ? 'reserved' : 'available';
};

const getAll = (req, res) => {
  res.json(mapReservationsToResponse(reservations));
};

const create = (req, res) => {
  const normalized = normalizeReservationInput(req.body);
  const { toolId, startDate, endDate } = normalized;
  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    return res.status(404).json({ message: 'Ferramenta não encontrada' });
  }

  if (tool.status === 'maintenance') {
    return res.status(400).json({ message: 'Ferramenta está em manutenção' });
  }

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end || start > end) {
    return res.status(400).json({ message: 'Intervalo de datas inválido' });
  }

  const conflict = reservations.some(r => r.toolId === toolId && hasConflict(start, end, parseDate(r.startDate), parseDate(r.endDate)));
  if (conflict) {
    return res.status(400).json({ message: 'Conflito de data ou ferramenta indisponível' });
  }

  const id = reservations.length + 1;
  const reservation = {
    id,
    toolId,
    startDate,
    endDate,
    status: 'reserved',
    userId: req.userId,
  };

  reservations.push(reservation);
  syncToolStatus(tool.id);
  res.status(201).json(mapReservationToResponse(reservation));
};

const remove = (req, res) => {
  const index = reservations.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Reserva não encontrada' });

  const [deleted] = reservations.splice(index, 1);
  syncToolStatus(deleted.toolId);
  res.json({ message: 'Reserva deletada' });
};

module.exports = {
  getAll,
  create,
  remove,
};