require('dotenv').config();

const cors = require('@fastify/cors');
const fastify = require('fastify')({logger: true});
const mongoosePlugin = require('./plugins/mongoose');
const { trie,buildTrie } = require('./plugins/trieConnector');

fastify.register(mongoosePlugin,{uri : process.env.MONGO_URI}); //  add support for passwords

const trieReady = new Promise((resolve, reject) => {
  fastify.ready().then(async () => {
    await buildTrie(fastify.mongo.db);
    resolve();
  }).catch(reject);
});

//create parent routes exporter

fastify.register(require('./routes/user'));
fastify.register(require('./routes/question'));
fastify.register(require('./routes/post'));
fastify.register(require('./routes/answer'));
fastify.register(require('./routes/like'));
fastify.register(require('./routes/search'));
fastify.register(cors, { origin : "*",});

fastify.get('/info', (req, reply) => { //change this to health check endpoint
  reply.send({ hello: 'world' })
})

const start = async() => { 
  //add gracefull shut downs , with propper logs
  //add winston logger
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

start();

module.exports = {trieReady};