import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import pump from 'pump';

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

// uploadRoutes.ts (opcional, ou direto no server.ts)

app.post('/upload', async (req, reply) => {
  try {
    const data = await req.file();

    if (!data) {
      return reply.code(400).send({ erro: 'Nenhum arquivo enviado' });
    }

    // Validação de tipo (apenas imagens)
    if (!data.mimetype.startsWith('image/')) {
      return reply.code(400).send({ erro: 'Apenas arquivos de imagem são permitidos' });
    }

    // Define subpasta por tipo (opcional, mas organizado)
    const subfolder = (req.headers['x-upload-type'] as string) || 'general';
    const uploadDir = path.join(__dirname, 'uploads', subfolder);

    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadDir, filename);

    await pump(data.file, fs.createWriteStream(filepath));

    const imageUrl = `http://localhost:3333/uploads/${subfolder}/${filename}`;

    return reply.code(200).send({ imagem_evento: imageUrl });
  } catch (error) {
    console.error('Erro no upload:', error);
    return reply.code(500).send({ erro: 'Falha ao salvar imagem' });
  }
});

// CONFIGURAÇÃO CORS - VERSÃO 8.x
app.register(fastifyCors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-upload-type'],
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