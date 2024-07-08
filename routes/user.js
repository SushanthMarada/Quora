const fp = require('fastify-plugin');
const userController = require('../controllers/user');

async function routes(fastify, options){
    fastify.post('/signup',userController.signup);
    fastify.post('/login',userController.login);
}

module.exports = fp(routes);