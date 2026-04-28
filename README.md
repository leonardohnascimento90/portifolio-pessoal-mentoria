# Tool Rental API

A RESTful API for managing tool rentals in an engineering company. Built with Node.js, Express, and in-memory storage.

## Features

- User authentication with JWT
- Equipment management
- Reservation system with calendar availability
- Daily and weekly rental rates
- Swagger documentation
- Automated tests with Mocha, Chai, and Supertest

## User Stories

### Autenticação
- Como usuário, quero fazer login para acessar o sistema.
- Como usuário, quero fazer logout para encerrar minha sessão.

### Equipamentos
- Como administrador, quero cadastrar equipamentos.
- Como usuário, quero visualizar equipamentos disponíveis.

### Calendário
- Como usuário, quero visualizar disponibilidade por data.
- Como sistema, quero bloquear datas já reservadas.

### Reservas
- Como usuário, quero reservar um equipamento.
- Como usuário, quero cancelar uma reserva.

## Fluxo do Sistema

1. Usuário faz login
2. Seleciona equipamento
3. Escolhe período
4. Sistema valida disponibilidade
5. Sistema calcula valor
6. Usuário confirma reserva

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm start` to start the server
4. Access Swagger docs at `http://localhost:3000/api-docs`

## Testing

Run `npm test` to execute the test suite.

## API Endpoints

- `POST /auth/login` - Login
- `GET /equipment` - Get all equipment
- `GET /equipment/:id` - Get equipment by ID
- `GET /reservations` - Get all reservations
- `POST /reservations` - Create a reservation
- `DELETE /reservations/:id` - Delete a reservation