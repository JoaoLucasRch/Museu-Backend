import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({ message: 'Token não fornecido.' });
    }

    const [scheme, token] = authHeader.split(' ');

    console.log("Authorization:", authHeader);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return reply.status(401).send({ 
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido nas variáveis de ambiente');
      return reply.status(500).send({ message: 'Erro interno de configuração.' });
    }

    console.log("Token recebido:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: number;
      role: 'ARTISTA' | 'ADMIN';
      email?: string;
      iat?: number;
      exp?: number;
    };

    if (!decoded.id || !decoded.role) {
      return reply.status(401).send({ message: 'Token com estrutura inválida.' });
    }

    if (decoded.role !== 'ARTISTA' && decoded.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Cargo inválido no token.' });
    }

    request.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

  } catch (error: any) {

  console.error(error);

  if (error.name === "TokenExpiredError") {
    return reply.status(401).send({ message: "Token expirado." });
  }

  if (error.name === "JsonWebTokenError") {
    return reply.status(401).send({ message: "Token inválido." });
  }

  return reply.status(401).send({
    message: error.message,
  });
}
}