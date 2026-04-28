const statusMap = {
  available: 'disponível',
  unavailable: 'indisponível',
  maintenance: 'manutenção',
  reserved: 'reservado',
};

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
};