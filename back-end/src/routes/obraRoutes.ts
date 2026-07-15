import { FastifyInstance } from 'fastify';
import {
  createObra,
  getMyObras,
  deleteObra,
  getAllObras,
  updateObraStatus,
  getObrasArtista,
} from '../controllers/ObraController';
import { verifyJWT as authenticate } from '../middlewares/verifyJWT';

import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma';

export async function obraRoutes(app: FastifyInstance) {

  // Schema base da obra
  const obraSchema = {
    type: 'object',
    properties: {
      id_obra: { type: 'number', example: 1 },
      titulo_obra: { type: 'string', example: 'Noite Estrelada' },
      descricao_obra: { type: 'string', example: 'Uma pintura inspirada em Van Gogh.' },
      imagens_obras: { type: 'string', example: 'https://exemplo.com/imagem.jpg' },
      categoria_obra: { type: 'string', example: 'Pintura' },
      data_exposicao: { type: 'string', format: 'date-time', example: '2025-05-10T14:00:00Z' },
      data_fim_exposicao: { type: 'string', format: 'date-time', example: '2025-06-10T14:00:00Z' },
      status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada', 'exposta'], example: 'pendente' },
      artista_id: { type: 'number', example: 3 },
      edital_id: { type: 'number', example: 1 },
    },
  };

  // Corpo da criação de obra
  const createObraBody = {
    type: 'object',
    required: ['titulo_obra', 'descricao_obra', 'categoria_obra'],
    properties: {
      titulo_obra: { type: 'string' },
      descricao_obra: { type: 'string' },
      imagens_obras: { type: 'string' },
      categoria_obra: { type: 'string' },
      data_exposicao: { type: 'string', format: 'date-time' },
      data_fim_exposicao: { type: 'string', format: 'date-time' },
      edital_id: { type: 'number' },
    },
  };

  const updateStatusBody = {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada', 'exposta'] },  // ← ATUALIZADO
    },
  };


  app.get('/teste-obra', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: artistaId } = request.user as { id: number };

      // Query direta
      const result = await prisma.$queryRaw`
      SELECT id_obra, titulo_obra, data_envio 
      FROM obras 
      WHERE artista_id = ${artistaId}
      LIMIT 1
    `;

      console.log('🔍 Teste query:', result);
      return reply.send(result);
    } catch (error) {
      console.error('Erro no teste:', error);
      return reply.status(500).send({ error: 'Erro no teste' });
    }
  });

  app.get('/teste-data-envio', {
    preHandler: authenticate,
    schema: {
      summary: 'Teste data_envio',
      description: 'Rota de teste para verificar data_envio',
      tags: ['Teste'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: artistaId } = request.user as { id: number };

      // Query direta no banco
      const result = await prisma.$queryRaw`
      SELECT id_obra, titulo_obra, data_envio 
      FROM obras 
      WHERE artista_id = ${artistaId}
    `;

      console.log('🔍 Resultado do teste:', result);
      return reply.send(result);
    } catch (error) {
      console.error('Erro no teste:', error);
      return reply.status(500).send({ error: 'Erro no teste' });
    }
  });

  // ==================== CRIAR OBRA (ARTISTA) ====================
  app.post(
    '/',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Criar nova obra (Artista)',
        description: 'Permite que um artista cadastre uma nova obra, limitada a 3 pendentes.',
        security: [{ bearerAuth: [] }],
        body: createObraBody,
        response: {
          201: {
            description: 'Obra criada com sucesso',
            content: { 'application/json': { schema: obraSchema } },
          },
          400: {
            description: 'Erro de validação ou limite atingido',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Erro de validação ou limite atingido' } } },
              },
            },
          },
          403: {
            description: 'Acesso negado (somente ARTISTA)',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado (somente ARTISTA)' } } },
              },
            },
          },
        },
      },
    },
    createObra
  );

  // ==================== LISTAR OBRAS DO PRÓPRIO ARTISTA ====================
  app.get(
    '/minhas',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Listar minhas obras',
        description: 'Retorna todas as obras do artista autenticado.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Lista de obras do artista',
            content: { 'application/json': { schema: { type: 'array', items: obraSchema } } },
          },
          403: {
            description: 'Acesso negado (somente ARTISTA)',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado (somente ARTISTA)' } } },
              },
            },
          },
        },
      },
    },
    getMyObras
  );

  // ==================== EXCLUIR OBRA (ARTISTA) ====================
  app.delete(
    '/:id_obra',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Excluir obra',
        description: 'Permite ao artista excluir uma de suas obras enviadas.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { id_obra: { type: 'number', example: 5 } },
          required: ['id_obra'],
        },
        response: {
          200: {
            description: 'Obra excluída com sucesso',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Obra excluída com sucesso' } } },
              },
            },
          },
          403: {
            description: 'Sem permissão para excluir',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Sem permissão para excluir' } } },
              },
            },
          },
          404: {
            description: 'Obra não encontrada',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Obra não encontrada' } } },
              },
            },
          },
        },
      },
    },
    deleteObra
  );

  // ==================== LISTAR TODAS AS OBRAS (ADMIN) ====================
  app.get(
    '/admin',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Listar todas as obras (Admin)',
        description: 'Exibe todas as obras cadastradas no sistema, com informações do artista.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Lista de todas as obras',
            content: { 'application/json': { schema: { type: 'array', items: obraSchema } } },
          },
          403: {
            description: 'Acesso negado (somente ADMIN)',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado (somente ADMIN)' } } },
              },
            },
          },
        },
      },
    },
    getAllObras
  );

  // ==================== ATUALIZAR STATUS DA OBRA (ADMIN) ====================
  app.patch(
    '/admin/:id_obra/status',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Atualizar status da obra',
        description: 'Permite ao administrador alterar o status de uma obra (pendente, aprovada, rejeitada ou exposta).',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { id_obra: { type: 'number', example: 2 } },
          required: ['id_obra'],
        },
        body: updateStatusBody,
        response: {
          200: {
            description: 'Status atualizado com sucesso',
            content: { 'application/json': { schema: obraSchema } },
          },
          400: {
            description: 'Status inválido',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Status inválido' } } },
              },
            },
          },
          403: {
            description: 'Acesso negado (somente ADMIN)',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado (somente ADMIN)' } } },
              },
            },
          },
        },
      },
    },
    updateObraStatus
  );

  // ==================== LISTAR OBRAS DE UM ARTISTA ESPECÍFICO (ADMIN) ====================
  app.get(
    '/admin/artista/:artistaId',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Obras'],
        summary: 'Listar obras de um artista (Admin)',
        description:
          'Permite ao administrador listar obras de um artista específico, opcionalmente filtradas por status.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { artistaId: { type: 'number', example: 4 } },
          required: ['artistaId'],
        },
        querystring: {
          type: 'object',
          properties: { status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada', 'exposta'] } },  // ← ATUALIZADO
        },
        response: {
          200: {
            description: 'Lista de obras do artista',
            content: { 'application/json': { schema: { type: 'array', items: obraSchema } } },
          },
          403: {
            description: 'Acesso negado (somente ADMIN)',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado (somente ADMIN)' } } },
              },
            },
          },
        },
      },
    },
    getObrasArtista
  );
}