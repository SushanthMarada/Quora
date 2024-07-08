const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    body : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        deafult : Date.now
    },
    updateAt : {
        type : Date,
        default : Date.now
    }

});

// postSchema.index({body : 'text'});

//middleware to update the time stamp
postSchema.pre('save',function(next){
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post',postSchema);