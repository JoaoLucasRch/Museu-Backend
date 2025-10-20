import fastify from 'fastify';

const app = fastify({
    logger: true, 
});

app.setErrorHandler((error, request, reply) => {
    app.log.error(error); 

    if (error.validation) {
        return reply.status(400).send({
            message: 'Erro na validação dos dados',
            errors: error.validation,
        });
    }

    // Tratamento de erros genéricos
    return reply.status(500).send({ 
        message: 'Erro interno do servidor',
        error: error.message 
    });
});

const startServer = async () => {
    try {
        const PORT = 3333;
        await app.listen({ port: PORT });
        
        // Log de sucesso
        console.log(`🚀 Servidor ouvindo na porta http://localhost:${PORT}`);
        
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();