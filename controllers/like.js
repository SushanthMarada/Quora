const Like = require('../models/like');
const Answer = require('../models/answer');

class likeController {
    async likeAnswer(request, reply) {
        try {
            const { authorID, answerID } = request.body;
            let answer = await Answer.findById(answerID);
            if (!answer) {
                return reply.status(404).send({ msg: 'Answer not found' });
            }

            let like = await Like.findOne({ authorID, answerID });
            if (like) {
                return reply.status(400).send({ msg: 'You have already liked this answer' });
            }

            like = new Like({authorID,answerID});
            await like.save();

            answer.likes.push(like._id);
            await answer.save();

            reply.status(201).send({ msg: 'Answer liked successfully', like });
        } catch (err) {
            console.error(err.message);
            reply.status(500).send('Server Error');
        }
    }
    
}

module.exports = new likeController();