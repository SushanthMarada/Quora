/*
  TrieNode Class
*/
class TrieNode {
    constructor() {
      this.children = {}; //children list
      this.isEndOfWord = false;
      this.questions = [];//to store the qn ids that contain this word
    }
  }

/*
Trie Class : Allows insertion of a word, search of a word, collect all the suggestions based on the prefix,
              recursively updates the trie on deletion of a word.
*/
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
/*
  method to add word to trie
*/  
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
/*
    returns the suggestion words and the questionIDs as a map 
    if the suggestion for the word exists or an empty map
*/ 
    search(prefix) {
      // traverse upto the end of the prefix and
      // recursively collect all the suggestions and their respecitve questionIDs using _collectAllWords method
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
/*
    method to remove a questionID from the word in the trie 
*/
    remove(word,questionID){
      this.removehelper(this.root,word,questionID,0);
    }
/*
    method to delete the questionID from the leaf node of the word and
    then recursively update the trie if the questionID array became zero for the leaf and 
    then updating the whole trie.
*/
    removehelper(node,word,questionID,depth){
      if(!node) return false; //if the node is null return false
      //if word length matches the depth
      if(word.length === depth){
        // if the node is the end of the word
        if(node.isEndOfWord){
          //index of questionID in node.questions
          const index = node.questions.indexOf(questionID);
          if(index > -1){
            node.questions.splice(index,1); //removing the questionID from the array
          }
          if(node.questions.length == 0){
            node.isEndOfWord = false;
          }
        }
        // return true if node has no children and is not and end of any word
        return Object.keys(node.children).length === 0 && !node.isEndOfWord;
      }
      // the character at present depth
      const char = word[depth];
      // checking whether the node of this char is singly dependent on the questionID about to be deleted 
      if(this.removehelper(node.children[char],word,questionID,depth+1)){
        // delete the node if yes
        delete node[char];
        // and pass the information to the upper nodes
        return Object.keys(node.childen).length === 0 && !node.isEndOfWord;
      }

      return false;
    }
  }
  
  module.exports = Trie;
