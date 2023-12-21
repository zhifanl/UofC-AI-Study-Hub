const mongoose = require('mongoose');

const validReactions = ['love', 'like', 'cool', 'dislike'];

const messageReactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    reaction: {
        type: String,
        validate: {
            validator: function (value) {
                return validReactions.includes(value);
            },
            message: props => `${props.value} is not a valid reaction.`
        },
    },
});

const MessageReactionModel = mongoose.model('MessageReaction', messageReactionSchema);

module.exports = MessageReactionModel;
