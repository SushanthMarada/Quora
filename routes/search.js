// const {trieReady} = require('./../index');
const {trie,buildTrie,trieReady} = require('./../plugins/trieConnector');

async function Search(request, reply) {
  const { prefix } = request.query;
  if (!prefix) {
    return reply.status(400).send({ error: 'Prefix is required' });
  }
  await trieReady;
  const suggestionsMap = trie.search(prefix);
  const suggestionsObject = {};
  for (const [key, value] of suggestionsMap.entries()) {
    suggestionsObject[key] = value;
  }
  return reply.send(suggestionsObject);
};

module.exports = async function (fastify, opts) {
  fastify.get('/search',Search);
};