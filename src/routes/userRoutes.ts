import { FastifyInstance } from 'fastify';
import { getMyProfile, updateMyProfile } from '../controllers/userController';
import { verifyJWT as authenticate } from '../middlewares/verifyJWT';

export async function userRoutes(app: FastifyInstance) {

    app.addHook('preHandler', authenticate);

  // Schema base de usuário
  const userSchema = {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      nome: { type: 'string', example: 'Victor Emanuel' },
      email: { type: 'string', example: 'victor@email.com' },
      contato: { type: 'string', example: '(11) 99999-9999' },
      foto: { type: 'string', example: 'https://exemplo.com/avatar.jpg' },
      bio: { type: 'string', example: 'Artista visual apaixonado por ilustração digital.' },
      role: { type: 'string', enum: ['ARTISTA', 'ADMIN'], example: 'ARTISTA' },
    },
  };

  // Corpo da requisição para atualização de perfil
  const updateUserBody = {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Novo Nome' },
      email: { type: 'string', example: 'novoemail@email.com' },
      contato: { type: 'string', example: '(11) 98888-7777' },
      foto: { type: 'string', example: 'https://exemplo.com/nova-foto.jpg' },
      bio: { type: 'string', example: 'Atualizando minha bio artística!' },
    },
    additionalProperties: false,
  };

  // Rota: Visualizar o próprio perfil
  app.get('/me', {
    schema: {
      tags: ['Usuário'],
      summary: 'Visualizar próprio perfil',
      description: 'Retorna os dados do perfil do usuário autenticado (Artista ou Admin).',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Perfil recuperado com sucesso',
          content: {
            'application/json': { schema: userSchema },
          },
        },
        401: {
          description: 'Token JWT ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { message: { type: 'string', example: 'Token JWT ausente ou inválido' } },
              },
            },
          },
        },
        404: {
          description: 'Perfil não encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { message: { type: 'string', example: 'Perfil não encontrado' } },
              },
            },
          },
        },
      },
    },
  }, getMyProfile);

  // Rota: Atualizar o próprio perfil
  app.put('/me', {
    schema: {
      tags: ['Usuário'],
      summary: 'Atualizar próprio perfil',
      description:
        'Permite ao usuário autenticado atualizar seus dados pessoais. Campos como senha e role não podem ser alterados por esta rota.',
      security: [{ bearerAuth: [] }],
      body: updateUserBody,
      response: {
        200: {
          description: 'Perfil atualizado com sucesso',
          content: {
            'application/json': { schema: userSchema },
          },
        },
        400: {
          description: 'Erro de validação (ex: email inválido ou tentativa de alterar senha)',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Erro de validação' } } },
            },
          },
        },
        401: {
          description: 'Token JWT ausente ou inválido',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Token JWT ausente ou inválido' } } },
            },
          },
        },
        409: {
          description: 'Email já está em uso',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Email já está em uso' } } },
            },
          },
        },
        500: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Erro interno do servidor' } } },
            },
          },
        },
      },
    },
  }, updateMyProfile);
}
