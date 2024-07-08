require('dotenv').config();

const cors = require('@fastify/cors');

const fastify = require('fastify')({logger: true});
const mongoosePlugin = require('./plugins/mongoose');
const {trie,buildTrie} = require('./plugins/trieConnector');
const fastifyIO = require('fastify-socket.io');

fastify.register(mongoosePlugin,{uri : process.env.MONGO_URI});

const trieReady = new Promise((resolve, reject) => {
  fastify.ready().then(async () => {
    await buildTrie(fastify.mongo.db);
    resolve();
  }).catch(reject);
});

fastify.register(require('./routes/user'));
fastify.register(require('./routes/question'));
fastify.register(require('./routes/post'));
fastify.register(require('./routes/answer'));
fastify.register(require('./routes/like'));
fastify.register(require('./routes/search'));

fastify.register(cors, { 
  origin : "*",
  // methods : ["GET","POST"],
});

fastify.get('/', (req, reply) => {
  reply.send({ hello: 'world' })
})

const start = async() => {
    try{
        fastify.listen(process.env.PORT || 3000, '0.0.0.0');
        fastify.log.info(`Server running on port ${process.env.PORT}`);
        // console.log("trie : ", trie);
        // trieReady;
        // console.log(trie);
    }
    catch(err)
    {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();


// module.exports = {fastify, trie, trieReady};
module.exports = {trieReady};
