import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';

interface UserPayload {
    id: number;
    role: 'ARTISTA' | 'ADMIN';
}

interface AuthenticatedRequest extends FastifyRequest {
    user: UserPayload;
}

interface ObrasQuery {
  status?: 'pendente' | 'aprovada' | 'rejeitada'; // Tipos para o status
}


// criar obra (Artista)

export async function createObra(request: AuthenticatedRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user;

 if (role !== 'ARTISTA') {
    return reply.status(403).send({ message: 'Apenas artistas podem cadastrar obras.' });
  }

  const { titulo_obra, descricao_obra, imagens_obras, categoria_obra, data_exposicao, data_fim_exposicao } = request.body as any;

  try {
    // Verificar limite de obras pendentes
    const obrasPendentes = await prisma.obra.count({
      where: { artista_id: artistaId, status: 'pendente' },
    });

    if (obrasPendentes >= 3) {
      return reply.status(400).send({
        message: 'Limite de 3 obras pendentes atingido. Aguarde aprovação antes de cadastrar novas obras.',
      });
    }

    const novaObra = await prisma.obra.create({
      data: {
        titulo_obra,
        descricao_obra,
        imagens_obras,
        categoria_obra,
        data_exposicao,
        data_fim_exposicao,
        artista_id: artistaId,
      },
    });

    return reply.status(201).send(novaObra);
  } catch (error) {
    console.error('[createObra] Erro:', error);
    return reply.status(500).send({ message: 'Erro interno ao criar a obra.' });
  }
}


//listar obras de um artista
export async function getMyObras(request: AuthenticatedRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user;

  if (role !== 'ARTISTA') {
    return reply.status(403).send({ message: 'Apenas artistas podem visualizar suas obras.' });
  }

  try {
    const obras = await prisma.obra.findMany({
      where: { artista_id: artistaId },
      orderBy: { data_envio: 'desc' },
    });

    return reply.send(obras);
  } catch (error) {
    console.error('[getMyObras] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao buscar obras.' });
  }
}
// Excluir uma obra (Artista)
export async function deleteObra(request: AuthenticatedRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user;
  const { id_obra } = request.params as any;

  try {
    const obra = await prisma.obra.findUnique({ where: { id_obra: Number(id_obra) } });

    if (!obra) {
      return reply.status(404).send({ message: 'Obra não encontrada.' });
    }

    if (role !== 'ARTISTA' || obra.artista_id !== artistaId) {
      return reply.status(403).send({ message: 'Você não tem permissão para excluir esta obra.' });
    }

    await prisma.obra.delete({ where: { id_obra: Number(id_obra) } });

    return reply.send({ message: 'Obra excluída com sucesso.' });
  } catch (error) {
    console.error('[deleteObra] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao excluir a obra.' });
  }
}

//Excluir obra por Adm


// Listar todas as obras (ADMIN)
export async function getAllObras(request: AuthenticatedRequest, reply: FastifyReply) {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Apenas administradores podem visualizar todas as obras.' });
  }

  try {
    const obras = await prisma.obra.findMany({
      include: {
        artista: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { data_envio: 'desc' },
    });

    return reply.send(obras);
  } catch (error) {
    console.error('[getAllObras] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao listar obras.' });
  }
}
//listar obras de um artista específico (Adm)

export async function getObrasArtista(request: AuthenticatedRequest, reply: FastifyReply) {
  const { role } = request.user;
  const { artistaId } = request.params as any;
  const { status } = request.query as ObrasQuery;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Apenas administradores podem listar obras de outros artistas.' });
  }
  const idArtistaNumber = Number(artistaId);

  try {
    const whereClause: any = {
        artista_id: idArtistaNumber
    };

    if (status) {
        whereClause.status = status;
    }

    const obras = await prisma.obra.findMany({
      where: whereClause,
      include: {
          artista: {
             select: { id: true, nome: true, email: true },
          },
       },
      orderBy: { data_envio: 'desc' },
    });

    return reply.send(obras);
  } catch (error) {
    console.error('[getObras] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao buscar obras.' });
  }
}
// Atualizar status da obra (ADMIN)
export async function updateObraStatus(request: AuthenticatedRequest, reply: FastifyReply) {
  const { role } = request.user;
  const { id_obra } = request.params as any;
  const { status } = request.body as any;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Apenas administradores podem alterar o status de uma obra.' });
  }

  const validStatuses = ['pendente', 'aprovada', 'rejeitada'];
  if (!validStatuses.includes(status)) {
    return reply.status(400).send({ message: 'Status inválido. Use pendente, aprovada ou rejeitada.' });
  }

  try {
    const obra = await prisma.obra.update({
      where: { id_obra: Number(id_obra) },
      data: { status },
    });

    return reply.send({ message: 'Status atualizado com sucesso.', obra });
  } catch (error) {
    console.error('[updateObraStatus] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao atualizar status da obra.' });
  }
}