import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const AUTH_USER = __ENV.AUTH_USER || 'admin';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'password';
const MAX_RESPONSE_MS = 500;

if (!BASE_URL) {
  throw new Error('BASE_URL environment variable is required. Example: BASE_URL=http://localhost:3000 k6 run performance/tool-rental-api-test.js');
}

// ==============================
// HELPERS
// ==============================

function buildHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function parseJson(response) {
  try {
    return response.json();
  } catch (error) {
    return null;
  }
}

function getTodayPlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function reservationPayload(toolId) {
  const startOffset = Math.floor(Math.random() * 7) + 3;
  const duration = Math.floor(Math.random() * 3) + 1;

  return {
    toolId,
    startDate: getTodayPlusDays(startOffset),
    endDate: getTodayPlusDays(startOffset + duration),
  };
}

function chooseToolId(tools) {
  if (!Array.isArray(tools) || tools.length === 0) return null;

  const available = tools.filter(t => t.status === 'available');
  const list = available.length ? available : tools;

  return list[Math.floor(Math.random() * list.length)].id;
}

function validate(response, status) {
  return check(response, {
    [`status ${status}`]: (r) => r.status === status,
    'response < 500ms': (r) => r.timings.duration <= MAX_RESPONSE_MS,
  });
}

// ==============================
// SETUP (login único)
// ==============================

export function setup() {
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: AUTH_USER,
    password: AUTH_PASSWORD,
  }), {
    headers: buildHeaders(),
  });

  check(res, {
    'login success': (r) => r.status === 200,
  });

  const token = res.json('token');

  if (!token) {
    throw new Error('Falha ao obter token no setup');
  }

  return { token };
}

// ==============================
// CONFIG
// ==============================

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'], // aceita conflito de reserva
  },
  scenarios: {
    browse_tools: {
      executor: 'ramping-vus',
      exec: 'browseTools',
      stages: [
        { duration: '15s', target: 5 },
        { duration: '45s', target: 5 },
        { duration: '15s', target: 0 },
      ],
    },

    get_tool_by_id: {
      executor: 'ramping-arrival-rate',
      exec: 'getToolById',
      startRate: 1,
      timeUnit: '1s',
      stages: [
        { duration: '15s', target: 3 },
        { duration: '45s', target: 8 },
        { duration: '15s', target: 0 },
      ],
      preAllocatedVUs: 10,
      maxVUs: 30,
    },

    create_reservation_flow: {
      executor: 'ramping-arrival-rate',
      exec: 'createReservationFlow',
      startRate: 1,
      timeUnit: '1s',
      stages: [
        { duration: '20s', target: 2 },
        { duration: '1m', target: 5 },
        { duration: '30s', target: 3 },
        { duration: '20s', target: 0 },
      ],
      preAllocatedVUs: 20,
      maxVUs: 60,
    },
  },
};

// ==============================
// SCENARIOS
// ==============================

export function browseTools(data) {
  group('Browse tools', () => {
    const res = http.get(`${BASE_URL}/tools`, {
      headers: buildHeaders(data.token),
      tags: { name: 'get_tools' },
    });

    validate(res, 200);
  });

  sleep(Math.random() * 2 + 1);
}

export function getToolById(data) {
  group('Get tool by id', () => {
    const res = http.get(`${BASE_URL}/tools/1`, {
      headers: buildHeaders(data.token),
      tags: { name: 'get_tool_by_id' },
    });

    validate(res, 200);
  });

  sleep(Math.random() * 2 + 1);
}

export function createReservationFlow(data) {
  group('Reservation flow', () => {
    const headers = buildHeaders(data.token);

    // 1. Buscar ferramentas
    const toolsRes = http.get(`${BASE_URL}/tools`, {
      headers,
      tags: { name: 'get_tools_before_reservation' },
    });

    if (!validate(toolsRes, 200)) return;

    const tools = parseJson(toolsRes);
    const toolId = chooseToolId(tools);

    if (!toolId) return;

    // 2. Detalhe ferramenta
    const toolRes = http.get(`${BASE_URL}/tools/${toolId}`, {
      headers,
      tags: { name: 'get_tool_detail' },
    });

    if (!validate(toolRes, 200)) return;

    // 3. Criar reserva
    const payload = JSON.stringify(reservationPayload(toolId));

    const res = http.post(`${BASE_URL}/reservations`, payload, {
      headers,
      tags: { name: 'create_reservation' },
    });

    check(res, {
      'reservation created or conflict': (r) => r.status === 201 || r.status === 400,
      'reservation < 500ms': (r) => r.timings.duration <= MAX_RESPONSE_MS,
    });
  });

  sleep(Math.random() * 3 + 2);
}