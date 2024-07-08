const fp = require('fastify-plugin')
const likeController = require('../controllers/like');

async function routes(fastify, options) {
  fastify.post('/likes', likeController.likeAnswer);
};

module.exports = fp(routes);
