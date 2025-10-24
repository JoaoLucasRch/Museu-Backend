import { FastifyInstance } from 'fastify';
import { 
  register, 
  login, 
  loginGoogle, 
  forgotPassword,
  resetPassword,
  RegisterBody, 
  LoginBody 
} from '../controllers/authController';
import { verifyJWT } from '../middlewares/verifyJWT';

export async function authRoutes(app: FastifyInstance) {
    app.post('/login-google', loginGoogle);
    app.post<{ Body: RegisterBody }>('/register', register);
    app.post<{ Body: LoginBody }>('/login', login);
    app.post('/forgot-password', forgotPassword);
    app.post('/reset-password', resetPassword);
    
    app.post<{ Body: RegisterBody }>(
        '/register-admin',
        {
            preHandler: verifyJWT,
        },
        register
    );
}

export function getMuseumEmail(): string {
    return process.env.EMAIL_MUSEUM || 'museu@email.com';
}
