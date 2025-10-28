import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  register,
  login,
  loginGoogle,
  forgotPassword,
  resetPassword,
  RegisterBody,
} from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

// Corpo esperado para criação de admin
interface RegisterAdminBody {
  nome: string;
  email: string;
  senha: string;
  contato: string;
}

export async function authRoutes(app: FastifyInstance) {

  // Registrar novo usuário (padrão ARTISTA, mas ADMIN se autorizado)
  app.post('/register', {
    schema: {
      summary: 'Registrar novo usuário',
      description: 'Cria um novo usuário do tipo ARTISTA (ou ADMIN, se autorizado).',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'contato'],
        properties: {
          nome: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@email.com' },
          senha: { type: 'string', example: '12345678' },
          contato: { type: 'string', example: '(11) 91234-5678' },
          role: { type: 'string', enum: ['ARTISTA', 'ADMIN'], example: 'ARTISTA' },
        },
      },
      response: {
        201: { type: 'object', properties: { message: { type: 'string', example: 'Usuário criado com sucesso' } } },
        400: { type: 'object', properties: { message: { type: 'string', example: 'E-mail já cadastrado' } } },
      },
    },
  }, register);

  // Registrar novo administrador (requer token JWT de admin)
  app.post('/register-admin', {
    preHandler: verifyJWT,
    schema: {
      summary: 'Registrar novo administrador',
      description: 'Cria um novo usuário com papel ADMIN. Requer token JWT válido de um ADMIN existente.',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'contato'],
        properties: {
          nome: { type: 'string', example: 'Maria Oliveira' },
          email: { type: 'string', example: 'maria@admin.com' },
          senha: { type: 'string', example: 'senhaSegura123' },
          contato: { type: 'string', example: '(21) 98765-4321' },
        },
      },
      response: {
        201: { type: 'object', properties: { message: { type: 'string', example: 'Administrador criado com sucesso' } } },
        403: { type: 'object', properties: { message: { type: 'string', example: 'Acesso negado: apenas admins podem criar outros admins' } } },
      },
    },
  }, async (request, reply) => {
    const body = request.body as RegisterAdminBody;

    // Verifica se o usuário autenticado é ADMIN
    if (!request.user || request.user.role !== 'ADMIN') {
      return reply.status(403).send({
        message: 'Acesso negado: apenas admins podem criar outros admins.',
      });
    }

    // Cria um novo admin reaproveitando o controller `register`
    const fakeRequest = {
      body: { ...body, role: 'ADMIN' },
      user: request.user,
    } as unknown as FastifyRequest<{ Body: RegisterBody }>;

    return register(fakeRequest, reply);
  });

  // Login com email e senha
  app.post('/login', {
    schema: {
      summary: 'Login com email e senha',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', example: 'joao@email.com' },
          senha: { type: 'string', example: '12345678' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        401: { type: 'object', properties: { message: { type: 'string', example: 'Credenciais inválidas' } } },
      },
    },
  }, login);

  // Login com Google OAuth
  app.post('/login-google', {
    schema: {
      summary: 'Login com Google OAuth',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { token: { type: 'string', example: 'jwt-gerado-apos-google' } },
        },
        401: { type: 'object', properties: { message: { type: 'string', example: 'Token Google inválido' } } },
      },
    },
  }, loginGoogle);

  // Esqueci a senha
  app.post('/forgot-password', {
    schema: {
      summary: 'Solicitar redefinição de senha',
      description: 'Envia um link de redefinição de senha para o email informado.',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', example: 'usuario@email.com' } },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string', example: 'Email de recuperação enviado' } } },
        404: { type: 'object', properties: { message: { type: 'string', example: 'Usuário não encontrado' } } },
      },
    },
  }, forgotPassword);

  // Redefinir senha
  app.post('/reset-password', {
    schema: {
      summary: 'Redefinir senha',
      description: 'Permite redefinir a senha a partir de um token de recuperação enviado por email.',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['token', 'novaSenha'],
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' },
          novaSenha: { type: 'string', example: 'novaSenhaForte123' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string', example: 'Senha redefinida com sucesso' } } },
        400: { type: 'object', properties: { message: { type: 'string', example: 'Token inválido ou expirado' } } },
      },
    },
  }, resetPassword);
}

export function getMuseumEmail(): string {
  return process.env.EMAIL_MUSEUM || 'museu@email.com';
}
