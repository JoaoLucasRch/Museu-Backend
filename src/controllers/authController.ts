import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Body para registro
export interface RegisterBody {
    nome: string;
    email: string;
    senha: string;
    contato: string;
    role?: 'ARTISTA' | 'ADMIN';
}

//Body para login
export interface LoginBody {
    email: string;
    senha: string;
}

//Registro de usuário (ARTISTA público ou ADMIN via token)
export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { nome, email, senha, contato, role } = request.body;

  try {
    if (role === 'ADMIN') {
      if (!request.user || request.user.role !== 'ADMIN') {
        return reply
          .status(403)
          .send({ message: 'Apenas administradores podem criar outro administrador.' });
      }
    }

//Hash de senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        contato,
        role: role || 'ARTISTA', // padrão ARTISTA
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return reply.status(201).send(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado.' });
    }
    console.error('Erro no registro:', error);
    return reply.status(500).send({ message: 'Erro interno ao registrar usuário.' });
  }
}

// Login
export async function login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
) {
  const { email, senha } = request.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
        return reply.status(401).send({ message: 'Email ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
        return reply.status(401).send({ message: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
    );

    return reply.send({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    return reply.status(500).send({ message: 'Erro interno ao fazer login.' });
  }
}
