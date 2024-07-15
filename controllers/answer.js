const Answer = require('../models/answer');
const Question = require('../models/question');

class answerController {
    async createAnswer(request, reply) {
        const { authorID, body } = request.body;
        const { questionId } = request.params;

        try {
            const question = await Question.findById(questionId);
            if (!question) {
                return reply.status(404).send({ msg: 'Question not found' });
            }
            const answer = new Answer({ authorID, questionID: questionId, body });
            await answer.save();

            question.answers.push(answer._id);
            await question.save();
            return reply.status(201).send({ msg: 'Answer created successfully', answer });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async getAnswers(request, reply) {
        const { questionId } = request.params;

        try {
            const question = await Question.findById(questionId);
            if (!question) {
                return reply.status(404).send({ msg: 'Question not found' });
            }

            const populatedQuestion = await Question.findById(questionId).populate({
                    path: 'answers',
                    select: 'body',
                    populate: {
                        path: 'authorID',
                        select: 'name'
                    }
                })
                .exec();

            const answers = populatedQuestion.answers.map(answer => ({
                body: answer.body,
                author: answer.authorID.name
            }));

            return reply.status(200).send(answers);
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async updateAnswer(request, reply) {
        const { id } = request.params;
        const { body } = request.body;

        try {
            const answer = await Answer.findById(id);
            if (!answer) {
                return reply.status(404).send({ msg: 'Answer not found' });
            }

            answer.body = body || answer.body;
            await answer.save();

            return reply.status(200).send({ msg: 'Answer updated successfully', answer });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }

    async deleteAnswer(request, reply) {
        const { id } = request.params;

        try {
            const answer = await Answer.findById(id);
            if (!answer) {
                return reply.status(404).send({ msg: 'Answer not found' });
            }

            await answer.remove();

            // Remove answer reference from associated question
            const question = await Question.findById(answer.questionID);
            if (question) {
                question.answers.pull(answer._id);
                await question.save();
            }

            return reply.status(200).send({ msg: 'Answer deleted successfully' });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    }
}
module.exports = new answerController();