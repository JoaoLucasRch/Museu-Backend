import { FastifyReply, FastifyRequest } from 'fastify';

export async function checkAdminCreation(request: FastifyRequest, reply: FastifyReply) {
    const { role } = request.body as { role?: 'ARTISTA' | 'ADMIN' };

    if (role === 'ADMIN') {

    if (!request.user || request.user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Apenas administradores podem criar outro administrador.' });
    }
    }
}