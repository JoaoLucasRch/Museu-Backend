import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { eventoRoutes } from './routes/eventoRoutes.js';
import { obraRoutes } from './routes/obraRoutes.js';

const app = fastify({
  logger: true,
  ajv: {
    customOptions: { strict: false },
  },
});

// Swagger (documentação técnica da API)
app.register(swagger, {
  openapi: {
    info: {
      title: 'API Museu — Documentação Swagger',
      description: 'API para gerenciamento de usuários, obras e eventos do Museu.',
      version: '1.0.0',
    },
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
});

// Swagger UI (interface visual)
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// Rotas principais
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/user' });
app.register(eventoRoutes);
app.register(obraRoutes, { prefix: '/obra' });

app.get('/health', async () => ({ status: 'OK' }));

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);

  if ((error as any).validation) {
    return reply.status(400).send({
      message: 'Erro de validação',
      errors: (error as any).validation,
    });
  }
  return reply.status(500).send({ message: 'Erro interno do servidor' });
});

const start = async () => {
  try {

    const address = await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log(`Servidor rodando em ${address}`);
    console.log(`Documentação disponível em ${address}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
