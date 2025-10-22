import { FastifyReply, FastifyRequest } from 'fastify';

export function authorizeRole(allowedRoles: ('ARTISTA' | 'ADMIN')[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
            return reply.status(401).send({ message: 'Não autenticado.' });
        }

        if (!allowedRoles.includes(request.user.role)) {
            return reply.status(403).send({ message: 'Acesso negado.' });
        }
  };
}
