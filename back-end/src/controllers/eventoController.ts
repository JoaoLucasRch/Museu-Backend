import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { TipoEvento } from '@prisma/client';

// ==================== LISTAR EVENTOS ====================
export async function listar(req: FastifyRequest, reply: FastifyReply) {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        criado_por: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        obras_editais: {
          include: {
            artista: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        data_hora_inicio: 'desc'
      }
    });
    return reply.code(200).send(eventos);
  } catch (error) {
    return reply.code(500).send({ erro: 'Erro ao listar eventos', detalhes: (error as Error).message });
  }
}

// ==================== BUSCAR EVENTO POR ID ====================
export async function buscarPorId(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const evento = await prisma.evento.findUnique({
      where: { id_evento: id },
      include: {
        criado_por: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        obras_editais: {
          include: {
            artista: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!evento) return reply.code(404).send({ erro: 'Evento não encontrado' });
    return reply.code(200).send(evento);
  } catch (error) {
    return reply.code(500).send({ erro: 'Erro ao buscar evento', detalhes: (error as Error).message });
  }
}

// ==================== CRIAR EVENTO ====================
export async function criar(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body as any;
    const {
      titulo_evento,
      descricao_evento,
      local_evento,
      imagem_evento,
      data_hora_inicio,
      data_hora_fim,
      tipo_evento,
      criado_por_id,
      eh_edital,
      inicio_submissao,
      fim_submissao,
    } = body;

    // Validação do tipo_evento
    const tipoUpper = String(tipo_evento ?? '').toUpperCase() as TipoEvento;
    if (!Object.values(TipoEvento).includes(tipoUpper)) {
      return reply.code(400).send({
        erro: `tipo_evento inválido. Use: ${Object.values(TipoEvento).join(', ')}`
      });
    }

    // Validação se for edital
    if (eh_edital) {
      if (!inicio_submissao || !fim_submissao) {
        return reply.code(400).send({
          erro: 'Para editais, os campos início_submissao e fim_submissao são obrigatórios'
        });
      }

      if (new Date(inicio_submissao) >= new Date(fim_submissao)) {
        return reply.code(400).send({
          erro: 'A data de início da submissão deve ser anterior à data de fim'
        });
      }

      if (new Date(inicio_submissao) < new Date(data_hora_inicio)) {
        return reply.code(400).send({
          erro: 'O início da submissão deve ser posterior ao início do evento'
        });
      }
    }

    const novoEvento = await prisma.evento.create({
      data: {
        titulo_evento,
        descricao_evento,
        local_evento: local_evento || 'Museu',
        imagem_evento: imagem_evento || '',
        data_hora_inicio: new Date(data_hora_inicio),
        data_hora_fim: new Date(data_hora_fim),
        tipo_evento: tipoUpper,
        criado_por_id: Number(criado_por_id),
        eh_edital: eh_edital || false,
        inicio_submissao: eh_edital ? new Date(inicio_submissao) : null,
        fim_submissao: eh_edital ? new Date(fim_submissao) : null,
      },
    });

    return reply.code(201).send(novoEvento);
  } catch (error) {
    console.error('[criar] Erro:', error);
    return reply.code(500).send({ erro: 'Erro ao criar evento', detalhes: (error as Error).message });
  }
}

// ==================== ATUALIZAR EVENTO ====================
export async function atualizar(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  const dados = req.body as any;

  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const eventoExistente = await prisma.evento.findUnique({
      where: { id_evento: id },
    });

    if (!eventoExistente) {
      return reply.code(404).send({ erro: 'Evento não encontrado' });
    }

    // Verificar se está tentando atualizar um edital
    const ehEdital = dados.eh_edital !== undefined ? dados.eh_edital : eventoExistente.eh_edital;

    if (ehEdital) {
      const inicio = dados.inicio_submissao || eventoExistente.inicio_submissao;
      const fim = dados.fim_submissao || eventoExistente.fim_submissao;

      if (!inicio || !fim) {
        return reply.code(400).send({
          erro: 'Para editais, os campos início_submissao e fim_submissao são obrigatórios'
        });
      }

      if (new Date(inicio) >= new Date(fim)) {
        return reply.code(400).send({
          erro: 'A data de início da submissão deve ser anterior à data de fim'
        });
      }

      // Se mudou de não-edital para edital, validar datas
      if (!eventoExistente.eh_edital && ehEdital) {
        const dataInicioEvento = dados.data_hora_inicio
          ? new Date(dados.data_hora_inicio)
          : eventoExistente.data_hora_inicio;

        if (new Date(inicio) < dataInicioEvento) {
          return reply.code(400).send({
            erro: 'O início da submissão deve ser posterior ao início do evento'
          });
        }
      }
    }

    // Atualizar apenas campos fornecidos
    const dataAtualizacao: any = {};

    if (dados.titulo_evento !== undefined) dataAtualizacao.titulo_evento = dados.titulo_evento;
    if (dados.descricao_evento !== undefined) dataAtualizacao.descricao_evento = dados.descricao_evento;
    if (dados.local_evento !== undefined) dataAtualizacao.local_evento = dados.local_evento;
    if (dados.imagem_evento !== undefined) dataAtualizacao.imagem_evento = dados.imagem_evento;
    if (dados.tipo_evento !== undefined) dataAtualizacao.tipo_evento = dados.tipo_evento;
    if (dados.data_hora_inicio !== undefined) dataAtualizacao.data_hora_inicio = new Date(dados.data_hora_inicio);
    if (dados.data_hora_fim !== undefined) dataAtualizacao.data_hora_fim = new Date(dados.data_hora_fim);
    if (dados.eh_edital !== undefined) dataAtualizacao.eh_edital = dados.eh_edital;

    // Campos de edital
    if (ehEdital) {
      if (dados.inicio_submissao !== undefined) {
        dataAtualizacao.inicio_submissao = new Date(dados.inicio_submissao);
      }
      if (dados.fim_submissao !== undefined) {
        dataAtualizacao.fim_submissao = new Date(dados.fim_submissao);
      }
    } else {
      dataAtualizacao.inicio_submissao = null;
      dataAtualizacao.fim_submissao = null;
    }

    const evento = await prisma.evento.update({
      where: { id_evento: id },
      data: dataAtualizacao,
    });

    return reply.code(200).send(evento);
  } catch (error: any) {
    if (error.code === 'P2025') return reply.code(404).send({ erro: 'Evento não encontrado' });
    console.error('[atualizar] Erro:', error);
    return reply.code(400).send({ erro: 'Erro ao atualizar evento', detalhes: error.message });
  }
}

// ==================== DELETAR EVENTO ====================
export async function deletar(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    // Verificar se existem obras vinculadas a este edital
    const obrasVinculadas = await prisma.obra.count({
      where: { edital_id: id }
    });

    if (obrasVinculadas > 0) {
      return reply.code(400).send({
        erro: `Não é possível excluir este edital pois existem ${obrasVinculadas} obra(s) vinculada(s) a ele`
      });
    }

    await prisma.evento.delete({ where: { id_evento: id } });
    return reply.code(200).send({ mensagem: 'Evento deletado com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') return reply.code(404).send({ erro: 'Evento não encontrado' });
    console.error('[deletar] Erro:', error);
    return reply.code(400).send({ erro: 'Erro ao deletar evento', detalhes: error.message });
  }
}

// ==================== LISTAR EDITAIS DISPONÍVEIS ====================
export async function listarEditaisDisponiveis(req: FastifyRequest, reply: FastifyReply) {
  try {
    const agora = new Date();

    const editais = await prisma.evento.findMany({
      where: {
        eh_edital: true,
        inicio_submissao: { lte: agora },
        fim_submissao: { gte: agora },
      },
      select: {
        id_evento: true,
        titulo_evento: true,
        descricao_evento: true,
        local_evento: true,
        data_hora_inicio: true,
        data_hora_fim: true,
        inicio_submissao: true,
        fim_submissao: true,
        imagem_evento: true,
      },
      orderBy: {
        fim_submissao: 'asc',
      },
    });

    // Adicionar dias_restantes para cada edital
    const editaisComDias = editais.map(edital => ({
      ...edital,
      dias_restantes: edital.fim_submissao 
        ? Math.ceil((new Date(edital.fim_submissao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0
    }));

    return reply.code(200).send(editaisComDias);
  } catch (error) {
    console.error('[listarEditaisDisponiveis] Erro:', error);
    return reply.code(500).send({
      erro: 'Erro ao listar editais disponíveis',
      detalhes: (error as Error).message
    });
  }
}

// ==================== VERIFICAR SE EDITAL ESTÁ DISPONÍVEL ====================
export async function verificarEditalDisponivel(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const agora = new Date();

    const edital = await prisma.evento.findFirst({
      where: {
        id_evento: id,
        eh_edital: true,
        inicio_submissao: { lte: agora },
        fim_submissao: { gte: agora },
      },
      select: {
        id_evento: true,
        titulo_evento: true,
        descricao_evento: true,
        local_evento: true,
        data_hora_inicio: true,
        data_hora_fim: true,
        inicio_submissao: true,
        fim_submissao: true,
      }
    });

    if (!edital) {
      return reply.code(404).send({
        erro: 'Edital não encontrado ou não está disponível para submissão no momento'
      });
    }

    // Verificar se fim_submissao existe antes de criar a data
    let diasRestantes = 0;
    if (edital.fim_submissao) {
      diasRestantes = Math.ceil(
        (new Date(edital.fim_submissao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return reply.code(200).send({
      disponivel: true,
      edital,
      dias_restantes: diasRestantes,
    });
  } catch (error) {
    console.error('[verificarEditalDisponivel] Erro:', error);
    return reply.code(500).send({
      erro: 'Erro ao verificar edital',
      detalhes: (error as Error).message
    });
  }
}

// ==================== LISTAR OBRAS DE UM EDITAL ====================
export async function listarObrasDoEdital(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const obras = await prisma.obra.findMany({
      where: { edital_id: id },
      include: {
        artista: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        }
      },
      orderBy: {
        data_envio: 'desc'
      }
    });

    return reply.code(200).send(obras);
  } catch (error) {
    console.error('[listarObrasDoEdital] Erro:', error);
    return reply.code(500).send({
      erro: 'Erro ao listar obras do edital',
      detalhes: (error as Error).message
    });
  }
}