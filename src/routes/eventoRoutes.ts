import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../middlewares/verifyJWT';
import { authorizeRole } from '../middlewares/authorizeRole';
import { listar, buscarPorId, criar, atualizar, deletar } from '../controllers/eventoController';

export async function eventoRoutes(app: FastifyInstance) {
  // rotas públicas/protegidas conforme sua lógica
  app.get('/eventos', { preHandler: [verifyJWT, authorizeRole(['ADMIN', 'ARTISTA'])] }, listar);
  app.get('/eventos/:id', { preHandler: [verifyJWT, authorizeRole(['ADMIN', 'ARTISTA'])] }, buscarPorId);

  app.post('/eventos', { preHandler: [verifyJWT, authorizeRole(['ADMIN'])] }, criar);
  app.put('/eventos/:id', { preHandler: [verifyJWT, authorizeRole(['ADMIN'])] }, atualizar);
  app.delete('/eventos/:id', { preHandler: [verifyJWT, authorizeRole(['ADMIN'])] }, deletar);
}
