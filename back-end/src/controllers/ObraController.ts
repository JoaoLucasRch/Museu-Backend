import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { EmailService } from '../services/emailService.js';

interface UserPayload {
  id: number;
  role: 'ARTISTA' | 'ADMIN';
}

interface ObrasQuery {
  status?: 'pendente' | 'aprovada' | 'rejeitada' | 'exposta';
}

// ==================== CRIAR OBRA (Artista) ====================
export async function createObra(request: FastifyRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user;

  if (role !== 'ARTISTA') {
    return reply.status(403).send({ message: 'Apenas artistas podem cadastrar obras.' });
  }

  const {
    titulo_obra,
    descricao_obra,
    imagens_obras,
    categoria_obra,
    data_exposicao,
    data_fim_exposicao,
    edital_id
  } = request.body as any;

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

    // Se for um edital, verificar se está disponível para submissão
    if (edital_id) {
      const agora = new Date();
      const edital = await prisma.evento.findFirst({
        where: {
          id_evento: Number(edital_id),
          eh_edital: true,
          inicio_submissao: { lte: agora },
          fim_submissao: { gte: agora },
        },
      });

      if (!edital) {
        return reply.status(400).send({
          message: 'Edital não está disponível para submissão no momento. Verifique as datas de submissão.',
        });
      }
    }

    const novaObra = await prisma.obra.create({
      data: {
        titulo_obra,
        descricao_obra,
        imagens_obras: imagens_obras || '',
        categoria_obra,
        data_exposicao: data_exposicao ? new Date(data_exposicao) : null,
        data_fim_exposicao: data_fim_exposicao ? new Date(data_fim_exposicao) : null,
        artista_id: artistaId,
        edital_id: edital_id ? Number(edital_id) : null,
        status: 'pendente',
      },
      select: {
        id_obra: true,
        titulo_obra: true,
        descricao_obra: true,
        imagens_obras: true,
        categoria_obra: true,
        status: true,
        data_envio: true,
        data_exposicao: true,
        data_fim_exposicao: true,
        artista_id: true,
        edital_id: true,
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        edital: {
          select: {
            id_evento: true,
            titulo_evento: true,
            descricao_evento: true,
            data_hora_inicio: true,
            data_hora_fim: true,
            inicio_submissao: true,
            fim_submissao: true,
          }
        }
      }
    });

    console.log(`Obra criada com sucesso: ${novaObra.id_obra}`);

    // ==================== NOTIFICAR ADMINISTRADORES ====================
    try {
      const administradores = await prisma.usuario.findMany({
        where: { role: 'ADMIN' },
        select: { email: true },
      });

      for (const admin of administradores) {
        if (admin.email) {
          await EmailService.notificarNovaSubmissao(
            admin.email,
            novaObra.artista.nome,
            novaObra.titulo_obra,
            novaObra.id_obra,
            novaObra.edital?.titulo_evento
          );
        }
      }
      console.log(`📧 Notificações enviadas para ${administradores.length} administradores`);
    } catch (emailError) {
      console.error('Erro ao notificar administradores:', emailError);
    }

    return reply.status(201).send(novaObra);
  } catch (error) {
    console.error('[createObra] Erro:', error);
    return reply.status(500).send({ message: 'Erro interno ao criar a obra.' });
  }
}

// ==================== LISTAR OBRAS DO ARTISTA ====================
export async function getMyObras(request: FastifyRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user as { id: number; role: string };

  if (role !== 'ARTISTA') {
    return reply.status(403).send({ message: 'Apenas artistas podem visualizar suas obras.' });
  }

  try {
    const rawResults = await prisma.$queryRaw`
      SELECT 
        o.id_obra,
        o.titulo_obra,
        o.descricao_obra,
        o.imagens_obras,
        o.categoria_obra,
        o.status,
        o.data_envio,
        o.data_exposicao,
        o.data_fim_exposicao,
        o.artista_id,
        o.edital_id,
        u.id as artista_id_join,
        u.nome as artista_nome,
        u.email as artista_email,
        e.id_evento as edital_id_evento,
        e.titulo_evento as edital_titulo
      FROM obras o
      LEFT JOIN usuarios u ON o.artista_id = u.id
      LEFT JOIN eventos e ON o.edital_id = e.id_evento
      WHERE o.artista_id = ${artistaId}
      ORDER BY o.data_envio DESC
    `;

    const obras = (rawResults as any[]).map(row => {
      let dataEnvio = '';
      if (row.data_envio) {
        if (row.data_envio instanceof Date) {
          dataEnvio = row.data_envio.toISOString();
        } else if (typeof row.data_envio === 'string') {
          dataEnvio = row.data_envio;
        } else {
          dataEnvio = String(row.data_envio);
        }
      }

      return {
        id_obra: Number(row.id_obra),
        titulo_obra: String(row.titulo_obra || ''),
        descricao_obra: String(row.descricao_obra || ''),
        imagens_obras: String(row.imagens_obras || ''),
        categoria_obra: String(row.categoria_obra || ''),
        status: String(row.status || 'pendente'),
        data_envio: dataEnvio,
        data_exposicao: String(row.data_exposicao || ''),
        data_fim_exposicao: String(row.data_fim_exposicao || ''),
        artista_id: Number(row.artista_id),
        edital_id: row.edital_id ? Number(row.edital_id) : 0,
        artista: row.artista_id_join ? {
          id: Number(row.artista_id_join),
          nome: String(row.artista_nome || ''),
          email: String(row.artista_email || ''),
        } : { id: 0, nome: '', email: '' },
        edital: row.edital_id_evento ? {
          id_evento: Number(row.edital_id_evento),
          titulo_evento: String(row.edital_titulo || ''),
        } : { id_evento: 0, titulo_evento: '' },
      };
    });

    // FORÇAR A RESPOSTA COMO JSON MANUAL
    const jsonResponse = JSON.stringify(obras);
    
    console.log('📦 Resposta JSON:', jsonResponse.substring(0, 200) + '...');
    
    return reply
      .header('Content-Type', 'application/json')
      .send(jsonResponse);
  } catch (error) {
    console.error('[getMyObras] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao buscar obras.' });
  }
}

// ==================== EXCLUIR OBRA (Artista) ====================
export async function deleteObra(request: FastifyRequest, reply: FastifyReply) {
  const { id: artistaId, role } = request.user;
  const { id_obra } = request.params as any;

  try {
    const obra = await prisma.obra.findUnique({
      where: { id_obra: Number(id_obra) },
      select: {
        id_obra: true,
        artista_id: true,
        status: true,
      }
    });

    if (!obra) {
      return reply.status(404).send({ message: 'Obra não encontrada.' });
    }

    if (role !== 'ARTISTA' || obra.artista_id !== artistaId) {
      return reply.status(403).send({ message: 'Você não tem permissão para excluir esta obra.' });
    }

    // Verificar se a obra já foi aprovada ou está em exposição
    if (obra.status === 'aprovada' || obra.status === 'exposta') {
      return reply.status(400).send({
        message: 'Não é possível excluir uma obra aprovada ou em exposição.',
      });
    }

    await prisma.obra.delete({ where: { id_obra: Number(id_obra) } });

    console.log(`🗑️ Obra ${id_obra} deletada com sucesso`);
    return reply.send({ message: 'Obra excluída com sucesso.' });
  } catch (error) {
    console.error('[deleteObra] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao excluir a obra.' });
  }
}

// ==================== LISTAR TODAS AS OBRAS (ADMIN) ====================
export async function getAllObras(request: FastifyRequest, reply: FastifyReply) {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Apenas administradores podem visualizar todas as obras.' });
  }

  try {
    // $queryRaw PARA GARANTIR data_envio
    const rawResults = await prisma.$queryRaw`
      SELECT 
        o.id_obra,
        o.titulo_obra,
        o.descricao_obra,
        o.imagens_obras,
        o.categoria_obra,
        o.status,
        o.data_envio,
        o.data_exposicao,
        o.data_fim_exposicao,
        o.artista_id,
        o.edital_id,
        u.id as artista_id_join,
        u.nome as artista_nome,
        u.email as artista_email,
        e.id_evento as edital_id_evento,
        e.titulo_evento as edital_titulo,
        e.data_hora_inicio as edital_data_inicio,
        e.data_hora_fim as edital_data_fim
      FROM obras o
      LEFT JOIN usuarios u ON o.artista_id = u.id
      LEFT JOIN eventos e ON o.edital_id = e.id_evento
      ORDER BY o.data_envio DESC
    `;

    // Mapear os resultados
    const obras = (rawResults as any[]).map(row => {
      let dataEnvio = '';
      if (row.data_envio) {
        if (row.data_envio instanceof Date) {
          dataEnvio = row.data_envio.toISOString();
        } else if (typeof row.data_envio === 'string') {
          dataEnvio = row.data_envio;
        } else {
          dataEnvio = String(row.data_envio);
        }
      }

      return {
        id_obra: Number(row.id_obra),
        titulo_obra: String(row.titulo_obra || ''),
        descricao_obra: String(row.descricao_obra || ''),
        imagens_obras: String(row.imagens_obras || ''),
        categoria_obra: String(row.categoria_obra || ''),
        status: String(row.status || 'pendente'),
        data_envio: dataEnvio,
        data_exposicao: String(row.data_exposicao || ''),
        data_fim_exposicao: String(row.data_fim_exposicao || ''),
        artista_id: Number(row.artista_id),
        edital_id: row.edital_id ? Number(row.edital_id) : null,
        artista: row.artista_id_join ? {
          id: Number(row.artista_id_join),
          nome: String(row.artista_nome || ''),
          email: String(row.artista_email || ''),
        } : null,
        edital: row.edital_id_evento ? {
          id_evento: Number(row.edital_id_evento),
          titulo_evento: String(row.edital_titulo || ''),
          data_hora_inicio: String(row.edital_data_inicio || ''),
          data_hora_fim: String(row.edital_data_fim || ''),
        } : null,
      };
    });

    const jsonResponse = JSON.stringify(obras);
    return reply
      .header('Content-Type', 'application/json')
      .send(jsonResponse);
  } catch (error) {
    console.error('[getAllObras] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao listar obras.' });
  }
}

// ==================== LISTAR OBRAS DE UM ARTISTA ESPECÍFICO (ADMIN) ====================
export async function getObrasArtista(request: FastifyRequest, reply: FastifyReply) {
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
      select: {
        id_obra: true,
        titulo_obra: true,
        descricao_obra: true,
        imagens_obras: true,
        categoria_obra: true,
        status: true,
        data_envio: true,
        data_exposicao: true,
        data_fim_exposicao: true,
        artista_id: true,
        edital_id: true,
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        edital: {
          select: {
            id_evento: true,
            titulo_evento: true,
            descricao_evento: true,
            data_hora_inicio: true,
            data_hora_fim: true,
            inicio_submissao: true,
            fim_submissao: true,
          }
        }
      },
      orderBy: { data_envio: 'desc' },
    });

    return reply.send(obras);
  } catch (error) {
    console.error('[getObrasArtista] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao buscar obras.' });
  }
}

// ==================== ATUALIZAR STATUS DA OBRA (ADMIN) ====================
export async function updateObraStatus(request: FastifyRequest, reply: FastifyReply) {
  const { role } = request.user;
  const { id_obra } = request.params as any;
  const { status, parecer } = request.body as any;

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Apenas administradores podem alterar o status de uma obra.' });
  }

  const validStatuses = ['pendente', 'aprovada', 'rejeitada', 'exposta'];
  if (!validStatuses.includes(status)) {
    return reply.status(400).send({
      message: 'Status inválido. Use pendente, aprovada, rejeitada ou exposta.'
    });
  }

  try {
    // Buscar a obra com os dados do artista (antes de atualizar)
    const obraExistente = await prisma.obra.findUnique({
      where: { id_obra: Number(id_obra) },
      include: {
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        edital: {
          select: {
            titulo_evento: true,
          }
        }
      }
    });

    if (!obraExistente) {
      return reply.status(404).send({ message: 'Obra não encontrada.' });
    }

    // Se o status não mudou, não faz nada
    if (obraExistente.status === status) {
      return reply.status(400).send({ 
        message: `A obra já está com o status "${status}".` 
      });
    }

    const obra = await prisma.obra.update({
      where: { id_obra: Number(id_obra) },
      data: { status },
      select: {
        id_obra: true,
        titulo_obra: true,
        descricao_obra: true,
        imagens_obras: true,
        categoria_obra: true,
        status: true,
        data_envio: true,
        data_exposicao: true,
        data_fim_exposicao: true,
        artista_id: true,
        edital_id: true,
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        edital: {
          select: {
            id_evento: true,
            titulo_evento: true,
            descricao_evento: true,
            data_hora_inicio: true,
            data_hora_fim: true,
            inicio_submissao: true,
            fim_submissao: true,
          }
        }
      }
    });

    console.log(`Status da obra ${id_obra} atualizado para ${status}`);

    // ==================== ENVIAR NOTIFICAÇÃO POR EMAIL ====================
    let notificacaoEnviada = false;
    
    // Enviar notificação apenas se o status NÃO for 'pendente'
    if (status !== 'pendente' && obra.artista?.email) {
      try {
        notificacaoEnviada = await EmailService.notificarStatusObra(
          obra.artista.email,
          obra.artista.nome,
          obra.titulo_obra,
          status,
          parecer
        );

        if (notificacaoEnviada) {
          console.log(`📧 Notificação enviada para ${obra.artista.email}`);
        } else {
          console.warn(`Falha ao enviar notificação para ${obra.artista.email}`);
        }
      } catch (emailError) {
        console.error('Erro ao enviar email de notificação:', emailError);
      }
    }

    return reply.send({
      message: 'Status atualizado com sucesso.',
      obra,
      notificacao_enviada: notificacaoEnviada,
    });
  } catch (error) {
    console.error('[updateObraStatus] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao atualizar status da obra.' });
  }
}

// ==================== BUSCAR OBRA POR ID ====================
export async function getObraById(request: FastifyRequest, reply: FastifyReply) {
  const { id_obra } = request.params as any;
  const { id: usuarioId, role } = request.user;

  try {
    const obra = await prisma.obra.findUnique({
      where: { id_obra: Number(id_obra) },
      select: {
        id_obra: true,
        titulo_obra: true,
        descricao_obra: true,
        imagens_obras: true,
        categoria_obra: true,
        status: true,
        data_envio: true,
        data_exposicao: true,
        data_fim_exposicao: true,
        artista_id: true,
        edital_id: true,
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        },
        edital: {
          select: {
            id_evento: true,
            titulo_evento: true,
            descricao_evento: true,
            data_hora_inicio: true,
            data_hora_fim: true,
            inicio_submissao: true,
            fim_submissao: true,
          }
        }
      },
    });

    if (!obra) {
      return reply.status(404).send({ message: 'Obra não encontrada.' });
    }

    // Verificar permissão: artista só pode ver suas próprias obras
    if (role === 'ARTISTA' && obra.artista_id !== usuarioId) {
      return reply.status(403).send({ message: 'Você não tem permissão para visualizar esta obra.' });
    }

    return reply.send(obra);
  } catch (error) {
    console.error('[getObraById] Erro:', error);
    return reply.status(500).send({ message: 'Erro ao buscar obra.' });
  }
}