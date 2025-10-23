import { FastifyInstance } from 'fastify';
import { 
    createObra, 
    getMyObras, 
    deleteObra, 
    getAllObras, 
    updateObraStatus,
    getObrasArtista

} from '../controllers/ObraController';
import { verifyJWT as authenticate } from '../middlewares/verifyJWT'; // Renomeado para 'authenticate'
// O checkAdminCreation foi removido daqui porque ele estava impedindo a autenticação

export async function obraRoutes(app: FastifyInstance) {
    // 1. Hook de Autenticação (OBRIGATÓRIO para popular request.user)
    // Aplica a verificação do JWT em todas as rotas neste plugin.
    app.addHook('preHandler', authenticate); 
    
    // As rotas estão definidas AGORA em relação ao prefixo /obra

    // ROTAS DE ARTISTA (prefixo: /obra)
    
    // POST /obra/
    // A rota raiz do plugin é usada para criar um novo recurso.
    app.post('/', createObra); 
    
    // GET /obra/minhas (Ajustando a rota GET para ser mais clara)
    app.get('/minhas', getMyObras);
    
    // DELETE /obra/:id_obra
    app.delete('/:id_obra', deleteObra); 

    // ROTAS DE ADMIN (Com caminhos explícitos para o prefixo)
    
    // GET /obra/admin
    // (A rota do Admin é colocada aqui, mas ela DEVE verificar o role internamente)
    app.get('/admin', getAllObras); 
    
    // PATCH /obra/admin/:id_obra/status
    app.patch('/admin/:id_obra/status', updateObraStatus);

    app.get('/admin/:artistaId', getObrasArtista);
}
