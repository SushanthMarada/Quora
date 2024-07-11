const Question = require('../models/question');
const User = require('../models/user');
const trie = require('./../plugins/trieConnector').trie;


class questionController {
    async createQuestion(request, reply) {
        
        const { body, authorID } = request.body;

        try {
            const author = await User.findById(authorID);
            if (!author) {
                return reply.status(404).send({ msg: 'Author not found' });
            }
            const question = new Question({ body, authorID });
            await question.save();
            const words = question.body.toLowerCase().split(/\s+/);
            words.forEach(word => {
                const cleanedWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                trie.insert(cleanedWord,question._id);
              });
            return reply.status(201).send({ msg: 'Question created successfully.', question });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async getQuestions(request, reply) {
        const { authorID } = request.params;

        try {
            const questions = await Question.find({ authorID });
            return reply.status(200).send(questions);
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async getQuestion(request, reply) {
        const { id } = request.params;

        try {
            const question = await Question.findById(id).populate('authorID');
            if (!question) {
                return reply.status(404).send({ msg: 'Question not found' });
            }
            return reply.status(200).send(question);
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async updateQuestion(request, reply) {
        const { id } = request.params;
        const { body } = request.body;

        try {
            const question = await Question.findById(id);
            if (!question) {
                return reply.status(404).send({ msg: 'Question not found' });
            }
            
            if (question.authorID.toString() !== request.body.authorID) {
                return reply.status(403).send({ msg: 'Unauthorized to update this question' });
            }
            const old_words = question.body.toLowerCase().split(/\s+/);
            old_words.forEach(word => {
                const cleanedWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                trie.remove(cleanedWord,question._id);
              });
            question.body = body || question.body;
            await question.save();
            const words = question.body.toLowerCase().split(/\s+/);
            words.forEach(word => {
                const cleanedWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                trie.insert(cleanedWord,question._id);
              });
            return reply.status(200).send({ msg: 'Question updated successfully', question });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async deleteQuestion(request, reply) {
        const { id } = request.params;

        try {
            const question = await Question.findById(id);
            if (!question) {
                return reply.status(404).send({ msg: 'Question not found' });
            }
            
            if (question.authorID.toString() !== request.body.authorID) {
                return reply.status(403).send({ msg: 'Unauthorized to delete this question' });
            }

            const result = await Question.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return reply.status(404).send({ msg: 'Question not found' });
            }
            const words = question.body.toLowerCase().split(/\s+/);
            words.forEach(word => {
                const cleanedWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                trie.remove(cleanedWord,question._id);
              });
            return reply.status(200).send({ msg: 'Question deleted successfully' });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

}

module.exports = new questionController();