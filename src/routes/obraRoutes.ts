import { FastifyInstance } from 'fastify';
import { 
    createObra, 
    getMyObras, 
    deleteObra, 
    getAllObras, 
    updateObraStatus,
    getObrasArtista

} from '../controllers/ObraController';
import { verifyJWT as authenticate } from '../middlewares/verifyJWT';

export async function obraRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authenticate); 
    
    app.post('/', createObra); 
 
    app.get('/minhas', getMyObras);
    
    app.delete('/:id_obra', deleteObra); 

    app.get('/admin', getAllObras); 
    
    app.patch('/admin/:id_obra/status', updateObraStatus);

    app.get('/admin/artista/:artistaId', getObrasArtista);
}
