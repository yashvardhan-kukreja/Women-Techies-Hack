const Favorite = require('./favoriteModel');

const searchQuery = [
    {
        path: 'favoredByStudent',
        model: 'Student'
    },
    {
        path: 'favoriteTeacher',
        model: 'Teacher',
        populate: {
            path: 'skills',
            model: 'Skill'
        }
    },
    {
        path: 'skill',
        model: 'Skill'
    }
];

module.exports.findFavoriteById = (id, next) => {
    Favorite.findOne({_id: id}).populate(searchQuery).exec(next);
};

module.exports.addFavorite = (student_id, teacher_id, skill_id, next) => {
    let newFavorite = new Favorite({
        favoredByStudent: student_id,
        favoriteTeacher: teacher_id,
        skill: skill_id
    });
    newFavorite.save(next);
};

module.exports.findFavoritesForAStudent = (student_id, next) => {
    // TODO: Remove student ids from the next query
    Favorite.find({favoredByStudent: student_id}).populate(searchQuery).exec(next);
};

module.exports.findFavoredStudentsOfATeacher = (teacher_id, next) => {
    Favorite.find({favoriteTeacher: teacher_id}).populate(searchQuery).exec(next);
};

module.exports.removeFavorite = (student_id, teacher_id, skill_id, next) => {
    Favorite.deleteOne({favoredByStudent: student_id, favoriteTeacher: teacher_id, skill: skill_id}).exec(next);
};