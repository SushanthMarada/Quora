const fp = require('fastify-plugin')
const answerController = require('../controllers/answer');

async function routes(fastify, options) {
  fastify.post('/:questionId', answerController.createAnswer);
  fastify.get('/:questionId', answerController.getAnswers);
  fastify.put('/:id', answerController.updateAnswer);
  fastify.delete('/:id', answerController.deleteAnswer);
};

module.exports = fp(routes);
