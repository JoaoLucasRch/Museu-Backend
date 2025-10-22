import { FastifyInstance } from 'fastify';
import { getMyProfile, updateMyProfile } from '../controllers/userController'; 
import { verifyJWT as authenticate } from '../middlewares/verifyJWT';


export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authenticate); 
    
//Rotas de Perfil
    app.get('/me', getMyProfile);
    app.put('/me', updateMyProfile);
}