const mongoose = require('mongoose');

var favoriteSchema = new mongoose.Schema({
    favoredByStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    favoriteTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }
});

// Making sure that there is no more than one favorite object containing same studentid, teacherid and skillid
favoriteSchema.index({favoredByStudent: 1, favoriteTeacher: 1, skill: 1}, {unique: true});

module.exports = mongoose.model('Favorite', favoriteSchema, "favorites");