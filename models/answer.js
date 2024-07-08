const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    questionID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Question',
        required : true
    },
    body : {
        type : String,
        required : true
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Like'
    }]
});

module.exports = mongoose.model('Answer',answerSchema);