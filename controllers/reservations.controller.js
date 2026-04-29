const { tools, reservations } = require('../utils/data');
const { mapReservationsToResponse, mapReservationToResponse, normalizeReservationInput } = require('../utils/mappers');

const parseDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const localDateMatch = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(value);
  if (localDateMatch) {
    const [, year, month, day] = localDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const hasConflict = (startA, endA, startB, endB) => startA <= endB && startB <= endA;

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isActiveReservation = (reservation) => {
  const today = getToday();
  const start = parseDate(reservation.startDate);
  const end = parseDate(reservation.endDate);
  return start && end && start <= today && today <= end;
};

const getNextReservationId = () => {
  const highestId = reservations.reduce((maxId, reservation) => Math.max(maxId, reservation.id), 0);
  return highestId + 1;
};

const validateUserId = (userId) => userId !== undefined && userId !== null;

const hasRequiredReservationFields = ({ toolId, startDate, endDate }) =>
  toolId !== undefined && toolId !== null && startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null;

const syncToolStatus = (toolId) => {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool || tool.status === 'maintenance') return;

  const hasActive = reservations.some((r) => r.toolId === toolId && isActiveReservation(r));
  tool.status = hasActive ? 'unavailable' : 'available';
};

const getAll = (req, res) => {
  res.json(mapReservationsToResponse(reservations));
};

const create = (req, res) => {
  if (!validateUserId(req.userId)) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  const normalized = normalizeReservationInput(req.body);
  const toolId = Number(normalized.toolId);
  const { startDate, endDate } = normalized;

  if (!hasRequiredReservationFields(normalized)) {
    return res.status(400).json({ message: 'Campos obrigatórios: toolId, startDate e endDate' });
  }

  if (Number.isNaN(toolId)) {
    return res.status(400).json({ message: 'ID de ferramenta inválido' });
  }

  const tool = tools.find((t) => t.id === toolId);
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

  const conflict = reservations.some((r) =>
    r.toolId === toolId && hasConflict(start, end, parseDate(r.startDate), parseDate(r.endDate))
  );

  if (conflict) {
    return res.status(400).json({ message: 'Conflito de data ou ferramenta indisponível' });
  }

  const reservation = {
    id: getNextReservationId(),
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
  const reservationId = Number(req.params.id);
  if (Number.isNaN(reservationId)) {
    return res.status(400).json({ message: 'ID de reserva inválido' });
  }

  const index = reservations.findIndex((r) => r.id === reservationId);
  if (index === -1) {
    return res.status(404).json({ message: 'Reserva não encontrada' });
  }

  const [deleted] = reservations.splice(index, 1);
  syncToolStatus(deleted.toolId);
  res.status(204).send();
};

module.exports = {
  getAll,
  create,
  remove,
};