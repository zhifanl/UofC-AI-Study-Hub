const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    description: String,
    avatar: String,
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
            required: true,
        },
        aiAnalysis: {
            analyzed: {
                type: Boolean,
                default: false,
            },
            generatedContent: String, // Store AI-generated content here
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
});

const GroupModel = mongoose.model('Group', groupSchema);

module.exports = GroupModel;
