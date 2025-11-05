const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Bug title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Bug description is required'],
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open',
        },
        priority: {
            type: String,
            required: true,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        category: {
            type: String,
            required: false
        },
        slug: {
            type: String,
            required: true
        },
        assignedTo: {
            type: String,
            default: 'Unassigned',
        },
    },
    {timestamps: true}
);


module.exports = mongoose.model('Bug', bugSchema);