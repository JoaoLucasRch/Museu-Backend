import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface UserPayload {
  id: number;
  role: 'ARTISTA' | 'ADMIN';
}

interface UserProfileRequest extends FastifyRequest {
  user: UserPayload;
}

//Visualizar Próprio Perfil
export async function getMyProfile(request: UserProfileRequest, reply: FastifyReply) {
  const userId = request.user.id; 

  try {
    const profile = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        nome: true,
        email: true,
        contato: true,
        foto: true,
        bio: true,
        role: true,
      }
    });

    if (!profile) {
      return reply.status(404).send({ message: 'Perfil não encontrado.' });
    }
    
    return reply.send(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return reply.status(500).send({ message: 'Erro interno ao buscar o perfil.' });
  }
}

//Atualizar Próprio Perfil
export async function updateMyProfile(request: UserProfileRequest, reply: FastifyReply) {
  const userId = request.user.id;
  const dadosAtualizacao = request.body as any;

  delete dadosAtualizacao.id; 
  delete dadosAtualizacao.role;
  
  if (dadosAtualizacao.senha) {
    return reply.status(400).send({ message: 'Use a rota específica para alteração de senha.' });
  }

  if (dadosAtualizacao.email && !isValidEmail(dadosAtualizacao.email)) {
    return reply.status(400).send({ message: 'Formato de email inválido.' });
  }

  if (dadosAtualizacao.email) {
    dadosAtualizacao.email = dadosAtualizacao.email.toLowerCase();
  }

  try {
    const updatedProfile = await prisma.usuario.update({
      where: { id: userId },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        contato: true,
        foto: true,
        bio: true,
        role: true,
      }
    });

    return reply.send(updatedProfile);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return reply.status(409).send({ message: 'Este email já está em uso.' });
    }
    console.error('Erro ao atualizar perfil:', error);
    return reply.status(500).send({ message: 'Erro interno ao atualizar o perfil.' });
  }
}