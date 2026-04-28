const statusMap = {
  available: 'disponível',
  unavailable: 'indisponível',
  maintenance: 'manutenção',
  reserved: 'reservado',
};

// Normaliza campos de entrada em português para inglês
const normalizeToolInput = (input) => ({
  name: input.nome || input.name,
  category: input.categoria || input.category,
  dailyRate: input.valorDiaria || input.dailyRate,
  weeklyRate: input.valorSemanal || input.weeklyRate,
});

const normalizeReservationInput = (input) => ({
  toolId: input.ferramentaId || input.toolId,
  startDate: input.dataInicio || input.startDate,
  endDate: input.dataFim || input.endDate,
});

const mapToolToResponse = (tool) => ({
  id: tool.id,
  nome: tool.name,
  categoria: tool.category,
  valorDiaria: tool.dailyRate,
  valorSemanal: tool.weeklyRate,
  status: statusMap[tool.status] || tool.status,
});

const mapReservationToResponse = (reservation) => ({
  id: reservation.id,
  ferramentaId: reservation.toolId,
  usuarioId: reservation.userId,
  dataInicio: reservation.startDate,
  dataFim: reservation.endDate,
  status: statusMap[reservation.status] || reservation.status,
});

const mapToolsToResponse = (tools) => tools.map(mapToolToResponse);
const mapReservationsToResponse = (reservations) => reservations.map(mapReservationToResponse);

module.exports = {
  mapToolToResponse,
  mapReservationToResponse,
  mapToolsToResponse,
  mapReservationsToResponse,
  normalizeToolInput,
  normalizeReservationInput,
};