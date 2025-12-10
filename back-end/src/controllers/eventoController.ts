import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma';
import { Prisma, TipoEvento } from '@prisma/client';

export async function listar(req: FastifyRequest, reply: FastifyReply) {
  try {
    const eventos = await prisma.evento.findMany({ include: { criado_por: true } });
    return reply.code(200).send(eventos);
  } catch (error) {
    return reply.code(500).send({ erro: 'Erro ao listar eventos', detalhes: (error as Error).message });
  }
}

export async function buscarPorId(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const evento = await prisma.evento.findUnique({ where: { id_evento: id }, include: { criado_por: true } });
    if (!evento) return reply.code(404).send({ erro: 'Evento não encontrado' });
    return reply.code(200).send(evento);
  } catch (error) {
    return reply.code(500).send({ erro: 'Erro ao buscar evento', detalhes: (error as Error).message });
  }
}

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
    } = body;

    const tipoUpper = String(tipo_evento ?? '').toUpperCase() as TipoEvento;
    if (!Object.values(TipoEvento).includes(tipoUpper)) {
      return reply.code(400).send({ erro: `tipo_evento inválido. Use: ${Object.values(TipoEvento).join(', ')}` });
    }

    const novoEvento = await prisma.evento.create({
      data: {
        titulo_evento,
        descricao_evento,
        local_evento,
        imagem_evento,
        data_hora_inicio: new Date(data_hora_inicio),
        data_hora_fim: new Date(data_hora_fim),
        tipo_evento: tipoUpper,
        criado_por_id: Number(criado_por_id),
      },
    });

    return reply.code(201).send(novoEvento);
  } catch (error) {
    return reply.code(500).send({ erro: 'Erro ao criar evento', detalhes: (error as Error).message });
  }
}

export async function atualizar(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  const dados = req.body as any;

  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    const evento = await prisma.evento.update({
      where: { id_evento: id },
      data: dados,
    });
    return reply.code(200).send(evento);
  } catch (error: any) {
    if (error.code === 'P2025') return reply.code(404).send({ erro: 'Evento não encontrado' });
    return reply.code(400).send({ erro: 'Erro ao atualizar evento', detalhes: error.message });
  }
}

export async function deletar(req: FastifyRequest, reply: FastifyReply) {
  const id = Number((req.params as any).id);
  if (Number.isNaN(id)) return reply.code(400).send({ erro: 'ID inválido' });

  try {
    await prisma.evento.delete({ where: { id_evento: id } });
    return reply.code(200).send({ mensagem: 'Evento deletado com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') return reply.code(404).send({ erro: 'Evento não encontrado' });
    return reply.code(400).send({ erro: 'Erro ao deletar evento', detalhes: error.message });
  }
}
