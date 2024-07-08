const fp = require('fastify-plugin')
const answerController = require('../controllers/answer');

async function routes(fastify, options) {
  fastify.post('/answers/:questionId', answerController.createAnswer);
  fastify.get('/answers/:questionId', answerController.getAnswers);
  fastify.put('/answers/:id', answerController.updateAnswer);
  fastify.delete('/answers/:id', answerController.deleteAnswer);
};

module.exports = fp(routes);
