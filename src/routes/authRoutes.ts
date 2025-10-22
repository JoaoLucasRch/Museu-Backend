import { FastifyInstance } from 'fastify';
import { register, login, RegisterBody, LoginBody } from '../controllers/authController';
import { verifyJWT } from '../middlewares/verifyJWT';

export async function authRoutes(app: FastifyInstance) {
    app.post<{ Body: RegisterBody }>('/register', register);
    app.post<{ Body: LoginBody }>('/login', login);
    app.post<{ Body: RegisterBody }>(
    '/register-admin',
    {
        preHandler: verifyJWT,
        handler: register
    }
    );
}
