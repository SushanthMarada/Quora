class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
      this.questions = [];
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word,questionID) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
      node.questions.push(questionID);
    }
  
    search(prefix) {
      let node = this.root;
      for (let char of prefix) {
        if (!node.children[char]) {
          return new Map();
        }
        node = node.children[char];
      }
      return this._collectAllWords(node, prefix);
    }
  
    _collectAllWords(node, prefix) {
      let resultMap = new Map();
      if (node.isEndOfWord) {
        resultMap.set(prefix,node.questions);
      }
      for (let char in node.children) {
        const childResults = this._collectAllWords(node.children[char], prefix + char);
        for(let [key,value] of childResults){
          resultMap.set(key,value);
        }
      }
      return resultMap;
    }

    remove(word,questionID){
      removehelper(this.root,word,questionID,0);
    }

    removehelper(node,word,questionID,depth){
      if(!node) return false;
      if(word.length === depth){
        if(node.isEndOfWord){
          const index = node.questions.indexOf(questionID);
          if(index > -1){
            node.questions.splice(index,1);
          }
          if(node.questions.length == 0){
            node.isEndOfWord = false;
          }
        }
        return Object.keys(node.children).length === 0 && !node.isEndOfWord;
      }

      const char = word[depth];

      if(this.removehelper(node.children[char],word,questionID,depth+1)){
        delete node[char];
        return Object.keys(node.childen).length === 0 && !node.isEndOfWord;
      }

      return false;
    }
  }
  
  module.exports = Trie;
