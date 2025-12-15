import { FastifyReply, FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { prisma } from '../prisma';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';

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

// Interface específica para requisições com multipart
interface MultipartRequest extends FastifyRequest {
  user: UserPayload;
  file(): Promise<MultipartFile | undefined>;
}

// Visualizar Próprio Perfil
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

// Atualizar Próprio Perfil
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

//Upload de Foto de Perfil
export async function uploadProfilePhoto(request: MultipartRequest, reply: FastifyReply) {
  const userId = request.user.id;

  try {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
    }

    // Validar tipo de arquivo (apenas imagens)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.status(400).send({
        message: 'Formato de arquivo inválido. Use: JPG, PNG ou WEBP.'
      });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    const chunks: Buffer[] = [];
    
    for await (const chunk of data.file) {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > maxSize) {
        return reply.status(400).send({
          message: 'Arquivo muito grande. Tamanho máximo: 5MB.'
        });
      }
    }

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'uploads', 'profile-photos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Buscar foto antiga do usuário para deletar depois
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { foto: true }
    });

    if (usuario?.foto && usuario.foto.includes('/uploads/')) {
      const oldPhotoPath = path.join(
        process.cwd(), 
        usuario.foto.replace('http://localhost:3333/', '')
      );
      if (fs.existsSync(oldPhotoPath)) {
        try {
          fs.unlinkSync(oldPhotoPath);
        } catch (err) {
          console.error('Erro ao deletar foto antiga:', err);
        }
      }
    }

    // Gerar nome único para o arquivo: usuario-{id}-{timestamp}.extensão
    const extension = path.extname(data.filename);
    const filename = `usuario-${userId}-${Date.now()}${extension}`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, Buffer.concat(chunks));

    // Gerar URL completa da foto
    const photoUrl = `http://localhost:3333/uploads/profile-photos/${filename}`;

    // Atualizar o banco de dados com a nova URL
    await prisma.usuario.update({
      where: { id: userId },
      data: { foto: photoUrl }
    });

    return reply.send({
      message: 'Foto atualizada com sucesso',
      foto: photoUrl
    });

  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    return reply.status(500).send({ message: 'Erro ao fazer upload da foto.' });
  }
}