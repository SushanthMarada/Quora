const fp = require('fastify-plugin');
const questionController = require('../controllers/question');

async function routes(fastify,options){
    fastify.post('/questions',questionController.createQuestion);
    fastify.get('/questions/question/:authorID',questionController.getQuestions);
    fastify.get('/questions/:id',questionController.getQuestion);
    fastify.put('/questions/:id',questionController.updateQuestion);
    fastify.delete('/questions/:id',questionController.deleteQuestion);
}

module.exports = fp(routes);