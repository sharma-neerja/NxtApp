const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const postSchema = new Schema ({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",        
    },
    image_url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        
    },
    views: {
        type: String,
        
    },    
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;