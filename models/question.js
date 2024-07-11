const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    body : {
        type : String,
        required : true
    },
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true   
    },
    createdAt : {
        type : Date,
        deafult : Date.now
    },
    updateAt : {
        type : Date,
        default : Date.now
    },
    answers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Answer'
    }]

});

questionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

QuestionModel = mongoose.model('Question',questionSchema);

 module.exports = QuestionModel
 