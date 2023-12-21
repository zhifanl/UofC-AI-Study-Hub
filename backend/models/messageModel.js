const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: Boolean,
    attachments: [String], // store attachment URLs here
    aiAnalysis: {
        analyzed: {
            type: Boolean,
            default: false,
        },
        generatedContent: String,
    },
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageReaction',
    }],
    type: {
        type: String,
        required: true,
        enum: ['text', 'voice'],
        default: 'text'
    },
    audioUrl: String, // URL to the stored audio file
    duration: Number, // Duration of the audio message
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
