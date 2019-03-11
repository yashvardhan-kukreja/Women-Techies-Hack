const Promise = require('bluebird');

const StudentTransactions = require('../database/student/studentTransactions');
const TeacherTransactions = require('../database/teacher/teacherTransactions');

try {
    var config = require('../config');
} catch (e) {
    console.log("Unable to access config variables");
}

const SECRET = process.env.SECRET || config.SECRET;

module.exports.registerStudent = (name, username, email, password, contact) => {
    return new Promise((resolve, reject) => {
        StudentTransactions.addStudent(name, username, email, password, contact, (err) => {
            if (err) {
                console.log(err);
                if (err.code === 11000)
                    reject({success: false, message: "A user already exists with the same details"});
                else
                    reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Registered Successfully"});
            }
        });
    });
};

module.exports.registerTeacher = (name, username, email, password, contact, skills) => {
    return new Promise((resolve, reject) => {
        TeacherTransactions.addTeacher(name, username, email, password, contact, skills, (err) => {
            if (err) {
                console.log(err);
                if (err.code === 11000)
                    reject({success: false, message: "A user already exists with the same details"});
                else
                    reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Registered Successfully"});
            }
        });
    });
};

module.exports.loginStudent = (input, password) => {
    return new Promise((resolve, reject) => {
        // TODO: change the next line by adding .exec((err, outputStudent) => {...}) at the end of it
        StudentTransactions.findStudentByUsernameOrEmail(input, (err, outputStudent) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputStudent)
                    reject({success: false, message: "No such user exists"});
                else {
                    StudentTransactions.verifyPassword(outputStudent, password, (err, correctPassword) => {
                        if (!correctPassword)
                            reject({success: false, message: "Wrong password entered"});
                        else {
                            let token = StudentTransactions.generateToken(outputStudent, SECRET);
                            resolve({success: true, message: "Logged in successfully", token: token});
                        }
                    });
                }
            }
        });
    });
};

module.exports.loginTeacher = (input, password) => {
    return new Promise((resolve, reject) => {
        // TODO: change the next line by adding .exec((err, outputTeacher) => {...}) at the end of it
        TeacherTransactions.findTeacherByUsernameOrEmail(input, (err, outputTeacher) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputTeacher)
                    reject({success: false, message: "No such user exists"});
                else {
                    TeacherTransactions.verifyPassword(outputTeacher, password, (err, correctPassword) => {
                        if (!correctPassword)
                            reject({success: false, message: "Wrong password entered"});
                        else {
                            let token = TeacherTransactions.generateToken(outputTeacher, SECRET);
                            resolve({success: true, message: "Logged in successfully", token: token});
                        }
                    });
                }
            }
        });
    });
};

module.exports.checkTeacherExistense = (email, username) => {
    return new Promise((resolve, reject) => {
        TeacherTransactions.findTeacherFromUsernameOrEmail([email, username], (err, outputUser) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (outputUser)
                    reject({success: false, message: "A teacher found with same email or username!"});
                else
                    resolve({success: true, message: "This is a unique teacher"});
            }
        });
    });
};
