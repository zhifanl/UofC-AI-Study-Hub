const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    // TODO: Should hash it before storing it.
    password: {
        required: true,
        type: String,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    directMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;