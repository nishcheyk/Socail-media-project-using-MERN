const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: String,
    favColor: String,
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    accountType: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    profilePicture: String,
    bio: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    followerNo: {
        type: Number,
        default: 0
        // Number of people who have followed the user
    },
    followingNo: {
        type: Number,
        default: 0 // Number of people who the user is following
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followRequests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
       
    }]
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;