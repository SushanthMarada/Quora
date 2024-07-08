const Trie = require('../trie');

const trie = new Trie();

const buildTrie = async (db) => {
  try {
    const collection = db.collection('questions');
    const questions = await collection.find({}).toArray();
    questions.forEach(question => {
      const words = question.body.toLowerCase().split(/\s+/);
      words.forEach(word => {
        const cleanedWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
        trie.insert(cleanedWord);
      });
    });
    console.log('Trie built successfully');
  } catch (err) {
    console.log('Error building Trie:', err);
  }
};

// const trieReady = 5;

// const trieReady = new Promise((resolve, reject) => {
//   fastify.ready().then(async () => {
//     await buildTrie(fastify.mongo.db);
//     resolve();
//   }).catch(reject);
// });

module.exports = {trie,buildTrie};
