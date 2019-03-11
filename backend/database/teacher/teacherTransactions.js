const Teacher = require('./teacherModel');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.findTeacherByUsernameOrEmail = (input, next) => {
    Teacher.findOne({$or:[{username: input}, {email: input}]}).exec(next);
};

module.exports.findTeacherFromUsernameOrEmail = (inputs, next) => {
    Teacher.findOne({$or: [ {username: {$in: inputs}}, {email: {$in: inputs}} ]}).exec(next)
};

module.exports.findTeacherByUsername = (input, next) => {
    Teacher.findOne({username: input}).exec(next);
};

module.exports.findTeacherByEmail = (input, next) => {
    Teacher.findOne({email: input}).exec(next);
};

module.exports.findTeacherById = (id, next) => {
    Teacher.findOne({_id: id}, {_id: 0, password: 0}).populate([{path: 'skills', model: 'Skill'}]).exec(next);
};

module.exports.addTeacher = (name, username, email, password, contact, skills, next) => {
    let newTeacher = new Teacher({
        name: name,
        username: username,
        email: email,
        password: password,
        contact: contact,
        skills: skills
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(newTeacher.password, salt, null, (err, hash) => {
            if (err)
                return next(err);
            newTeacher.password = hash;
            newTeacher.save(next);
        });
    });
};

module.exports.verifyPassword = (teacher, passwordInput, next) => {
    bcrypt.compare(passwordInput, teacher.password, (err, correctPassword) => err ? next(err, null) : next(null, correctPassword));
};

module.exports.generateToken = (teacher, secret) => {
    return jwt.sign(JSON.parse(JSON.stringify(teacher)), secret);
};

module.exports.appendStudent = (favoriteId, teacherId, next) => {
    Teacher.findOneAndUpdate({_id: teacherId}, {$addToSet: {students: favoriteId}}).exec(next);
};

module.exports.addSkills = (teacherId, skills, next) => {
    Teacher.findOneAndUpdate({_id: teacherId}, {$push: {skills: {$each: skills}}}).exec(next);
};

module.exports.addSkillsByEmail = (teacherEmail, skills, next) => {
    Teacher.findOneAndUpdate({email: teacherEmail}, {$push: {skills: {$each: skills}}}).exec(next);
};

module.exports.addASkill = (teacherId, skill, next) => {
    Teacher.findOneAndUpdate({_id: teacherId}, {$push: {skills: skill}}).exec(next);
};

module.exports.fetchAllTeachers = (next) => {
    Teacher.find({}).populate({path: "skills", model: "Skill"}).exec(next);
};
