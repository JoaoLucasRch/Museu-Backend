import 'fastify';

export interface UserPayload {
    id: number;
    role: 'ARTISTA' | 'ADMIN';
    email?: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user: UserPayload;
    }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
      role: 'ADMIN' | 'ARTISTA';
      email?: string;
    };
  }
}