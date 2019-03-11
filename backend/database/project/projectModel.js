const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description available"
    },
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        }
    ],
    link: {
        type: String
    }
});

module.exports = mongoose.model('Project', projectSchema, "projects");