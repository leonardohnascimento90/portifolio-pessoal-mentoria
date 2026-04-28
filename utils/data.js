// In-memory data
let tools = [
  { id: 1, name: 'Furadeira / Parafusadeira', category: 'Elétrica', dailyRate: 50, weeklyRate: 250, status: 'available' },
  { id: 2, name: 'Serra elétrica', category: 'Elétrica', dailyRate: 80, weeklyRate: 400, status: 'available' },
  { id: 3, name: 'Esmerilhadeira', category: 'Elétrica', dailyRate: 60, weeklyRate: 300, status: 'available' },
  { id: 4, name: 'Compactador de solo', category: 'Pneumática', dailyRate: 90, weeklyRate: 450, status: 'available' },
  { id: 5, name: 'Lixadeira', category: 'Elétrica', dailyRate: 40, weeklyRate: 200, status: 'available' },
  { id: 6, name: 'Compressor de ar', category: 'Pneumática', dailyRate: 70, weeklyRate: 350, status: 'available' },
  { id: 7, name: 'Martelete', category: 'Elétrica', dailyRate: 100, weeklyRate: 500, status: 'available' },
  { id: 8, name: 'Serra de bancada', category: 'Elétrica', dailyRate: 120, weeklyRate: 600, status: 'available' },
];

let reservations = [];

module.exports = { tools, reservations };