const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    answerID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Answer'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Like',likeSchema);