const Student = require('./studentModel');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.findStudentByUsernameOrEmail = (input, next) => {
    Student.findOne({$or:[{username: input}, {email: input}]}).exec(next);
};

module.exports.findStudentById = (id, next) => {
    Student.findOne({_id: id}, {_id: 0, password: 0}).populate({path: 'favTeachers', model: 'Favorite'}).exec(next);
};

module.exports.addStudent = (name, username, email, password, contact, next) => {
    let newStudent = new Student({
        name: name,
        username: username,
        email: email,
        password: password,
        contact: contact
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(newStudent.password, salt, null, (err, hash) => {
            if (err)
                return next(err);
            newStudent.password = hash;
            newStudent.save(next);
        });
    });
};

module.exports.verifyPassword = (student, passwordInput, next) => {
    bcrypt.compare(passwordInput, student.password, (err, correctPassword) => err ? next(err, null) : next(null, correctPassword));
};

module.exports.generateToken = (student, secret) => {
    return jwt.sign(JSON.parse(JSON.stringify(student)), secret);
};

module.exports.appendFavTeacher = (studentId, favoriteId, next) => {
    Student.findOneAndUpdate({_id: studentId}, {$addToSet: {favTeachers: favoriteId}}).exec(next);
};