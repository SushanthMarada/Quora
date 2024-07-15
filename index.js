require('dotenv').config();

const cors = require('@fastify/cors');
const fastify = require('fastify')({logger : true});
const mongoosePlugin = require('./plugins/mongoose');
const {connect} = require('./plugins/trieConnector');

fastify.register(mongoosePlugin,{uri : process.env.MONGO_URI});
connect(fastify);

//create parent routes exporter
fastify.register(require('./routes/user'));
fastify.register(require('./routes/question'));
fastify.register(require('./routes/post'));
fastify.register(require('./routes/answer'));
fastify.register(require('./routes/like'));
fastify.register(require('./routes/search'));
fastify.register(cors, { origin : "*",});

fastify.get('/health', (request, reply) => {
  try{
    const dbConnection = fastify.mongo.db.command({ ping: 1 });
    if (dbConnection.ok !== 1) {
      return reply.status(500).send({ status: 'fail', message: 'Database connection failed' });
    }

    return reply.status(200).send({ status: 'ok' });
  } catch (err) {
    fastify.log.error('Health check failed', err);
    return reply.status(500).send({ status: 'fail', message: 'Internal Server Error' });
  }  
});

const start = async() => { 
    try{
        fastify.listen({
          port : process.env.PORT || 3000,
          host : '0.0.0.0'
        });
        fastify.log.info(`Server running on port ${process.env.PORT}`);
    }
    catch(err)
    {
        fastify.log.error(err);
        process.exit(1);
    }
};

const shutdown = async(signal) => {
  fastify.log.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    await fastify.close();
    fastify.log.info('Server closed');
    process.exit(0);
  } catch (err) {
    fastify.log.error('Error during shutdown', err);
    process.exit(1);
  }
}

['SIGINT','SIGTERM'].forEach((signal) => {
  process.on(signal,() => shutdown(signal));
} );

start();
