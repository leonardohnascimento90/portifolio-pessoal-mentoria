const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const toolsRoutes = require('./routes/tools');
const reservationRoutes = require('./routes/reservation');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Aluguel de Ferramentas',
      version: '1.0.0',
      description: 'API para gerenciamento de aluguel de ferramentas',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/auth', authRoutes.router);
app.use('/tools', toolsRoutes.router);
app.use('/reservations', reservationRoutes); // ajuste aqui conforme export

// Start
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;