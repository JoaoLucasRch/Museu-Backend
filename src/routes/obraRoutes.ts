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

export async function obraRoutes(app: FastifyInstance) {

    app.addHook('preHandler', authenticate);

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
      status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada'], example: 'pendente' },
      artista_id: { type: 'number', example: 3 },
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
    },
  };

  const updateStatusBody = {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada'] },
    },
  };

  // Criar Obra (ARTISTA)
  app.post(
    '/',
    {
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

  // Listar obras do próprio artista
  app.get(
    '/minhas',
    {
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

  // Excluir obra (ARTISTA)
  app.delete(
    '/:id_obra',
    {
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

  // Listar todas as obras (ADMIN)
  app.get(
    '/admin',
    {
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

  // Atualizar status da obra (ADMIN)
  app.patch(
    '/admin/:id_obra/status',
    {
      schema: {
        tags: ['Obras'],
        summary: 'Atualizar status da obra',
        description: 'Permite ao administrador alterar o status de uma obra (pendente, aprovada ou rejeitada).',
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

  // Listar obras de um artista específico (ADMIN)
  app.get(
    '/admin/artista/:artistaId',
    {
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
          properties: { status: { type: 'string', enum: ['pendente', 'aprovada', 'rejeitada'] } },
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
