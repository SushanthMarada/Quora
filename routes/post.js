const fp = require('fastify-plugin')
const postController = require('../controllers/post');

async function routes(fastify,options){
    fastify.post('/posts',postController.createPost);
    fastify.get('/posts/:authorID',postController.getPosts);
    fastify.get('/posts/post/:id',postController.getPostbyId);
    fastify.put('/posts/:id',postController.updatePost);
    fastify.delete('/posts/:id',postController.deletePost);
    // done();
}

module.exports = fp(routes);