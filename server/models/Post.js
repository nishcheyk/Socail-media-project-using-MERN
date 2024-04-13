const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String, // Adding a field for the user's name
        required: true
    },
    accountType: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    }
    // You can add more fields as needed
}, { timestamps: true });

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
