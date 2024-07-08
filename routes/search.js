const {trie,buildTrie} = require('../plugins/trieConnector');
const {trieReady} = require('../index');
const fastify = require('fastify');
const Question = require('../models/question');

async function searchSuggestions(request, reply) {
  const { prefix } = request.query;
    // console.log(prefix);
    // console.log(trie);
  if (!prefix) {
    return reply.status(400).send({ error: 'Prefix is required' });
  }
  await trieReady;
  const suggestions = trie.search(prefix.toLowerCase());
  return reply.send(suggestions);
};

async function Search(request,reply){
    const {keyword} = request.query;
    
    if (!keyword) {
        return reply.status(400).send({ error: 'Keyword is required' });
      }
    
      try {
        const results = await Question.find({ body: { $regex: new RegExp(keyword, 'i') } }).populate('authorID').populate('answers');
        console.log(results);
        // return reply.send(results);
      } catch (error) {
        fastify.log.error('Error fetching search results:', error);
        return reply.status(500).send({ error: 'Error fetching search results' });
      }
}

module.exports = async function (fastify, opts) {
  fastify.get('/search/suggestions', searchSuggestions);
  fastify.get('/search',Search);
};
