import fastify from 'fastify';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';


const app = fastify({ logger: true });

//Rotas
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/user' });

app.get('/health', async () => ({ status: 'OK' }));

app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    if ((error as any).validation) {
        return reply.status(400).send({
            message: 'Erro de validação',
            errors: (error as any).validation,
        });
    }
    return reply.status(500).send({ message: 'Erro interno do servidor' });
});

//Inicia servidor
const start = async () => {
    try {
        const address = await app.listen({ port: 3333 });
        console.log(`Servidor rodando em ${address}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();