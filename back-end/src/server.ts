import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { eventoRoutes } from './routes/eventoRoutes.js';
import { obraRoutes } from './routes/obraRoutes.js';

const __dirname = process.cwd();

const app = fastify({
  logger: true,
  ajv: {
    customOptions: { strict: false },
  },
});

// Plugin de Upload de Arquivos
app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1, // Apenas 1 arquivo por vez
  },
});

app.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'), // Diretório uploads na raiz do projeto
  prefix: '/uploads/',
  decorateReply: true,
});

// CONFIGURAÇÃO CORS - VERSÃO 8.x
app.register(fastifyCors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 horas
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
    console.log(`Uploads disponíveis em ${address}/uploads/`);
    console.log(`Documentação disponível em ${address}/docs`);
    console.log(`CORS configurado: Permitindo todas as origens (*)`);
    console.log(`Fastify v4.29.1 com @fastify/cors v8.x`);
    console.log(`Upload de arquivos habilitado (máx 5MB)`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();