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
    
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
