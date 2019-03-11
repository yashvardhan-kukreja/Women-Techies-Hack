const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('Skill', skillSchema, "skills");