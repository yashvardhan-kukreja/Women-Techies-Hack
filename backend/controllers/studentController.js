const StudentTransactions = require('../database/student/studentTransactions');
const TeacherTransactions = require('../database/teacher/teacherTransactions');
const FavoriteTransactions = require('../database/favorite/favoriteTransactions');
const ProjectTransactions = require('../database/project/projectTransactions');

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

module.exports.verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    console.error(err);
                    reject({success: false, message: "An error occurred"});
                }
                else {
                    decoded ? resolve(decoded) : reject({success: false, message: "Corrupted token provided"});
                }
            });
        } else {
            reject({success: false, message: "No token provided"});
        }
    });
};

module.exports.fetchDetails = (id) => {
    return new Promise((resolve, reject) => {
        StudentTransactions.findStudentById(id, (err, outputStudent) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                outputStudent ? resolve({success: true, message: "Students details fetched", student: outputStudent}) : reject({success: false, message: "No such student found"});
            }
        });
    });
};

module.exports.favorTeacher = (studentId, teacherId, skillId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.addFavorite(studentId, teacherId, skillId, (err) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "A same favorite already found"});
            } else {
                resolve({success: true, message: "Teacher added to favorites"});
            }
        });
    });
};

module.exports.unfavorTeacher = (studentId, teacherId, skillId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.removeFavorite(studentId, teacherId, skillId, err => {
            if (err) {
                console.error(err);
                reject({success: false, message: "Problem occurred while removing the teacher from favorites"});
            } else {
                resolve({success: true, message: "Removed the teacher from favorites"});
            }
        });
    });
};

module.exports.fetchFavTeachers = (studentId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.findFavoritesForAStudent(studentId, (err, output) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output)
                    reject({success: false, message: "An error occurred"});
                else
                    resolve({success: true, message: "Favorite teachers fetched successfully", favTeachers: output});
            }
        });
    });
};

module.exports.fetchAllTeachers = () => {
    return new Promise((resolve, reject) => {
        TeacherTransactions.fetchAllTeachers((err, outputTeachers) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputTeachers)
                    reject({success: false, message: "No teachers found"});
                else
                    resolve({success: true, message: "Teachers fetched successfully!", teachers: outputTeachers})
            }
        });
    });
};

module.exports.fetchAllProjects = () => {
    return new Promise((resolve, reject) => {
        ProjectTransactions.fetchAllProjects((err, outputProjs) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputProjs)
                    reject({success: false, message: "No projects found"});
                else {
                    resolve({
                        success: true,
                        message: "All projects fetched successfully",
                        projects: outputProjs
                    });
                }
            }
        });
    });
}

module.exports.requestForAProject = (student_id, project_id) => {
    return new Promise((resolve, reject) => {
        ProjectTransactions.addARequest(project_id, student_id, (err, outputProject) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputProject)
                    reject({success: false, message: "No project found with the provided project id"});
                else
                    resolve({success: true, message: "Requested for the project successfully"});
            }
        });
    });
}

module.exports.fetchProjectsWithMyUnapprovedRequests = (user_id) => {
    return new Promise((resolve, reject) => {
        ProjectTransactions.fetchProjectsWithUnapprovedRequests(user_id, (err, outputProjs) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputProjs || outputProjs.length <= 0)
                    reject({success: false, message: "No projects found with unapproved requests"});
                else {
                    resolve({
                        success: true,
                        message: "Projects with unapproved requests fetched successfully",
                        projects: outputProjs
                    });
                }
            }
        });
    });
}

module.exports.fetchProjectsWithMyApprovedRequests = (user_id) => {
    return new Promise((resolve, reject) => {
        ProjectTransactions.fetchProjectsWithApproved(user_id, (err, outputProjs) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputProjs || outputProjs.length <= 0)
                    reject({success: false, message: "No projects found with approved requests"});
                else {
                    resolve({
                        success: true,
                        message: "Projects with approved requests fetched successfully",
                        projects: outputProjs
                    });
                }
            }
        });
    });
}