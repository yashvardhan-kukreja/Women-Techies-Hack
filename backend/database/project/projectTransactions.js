const Project = require("./projectModel");


module.exports.hostAProject = (teacher_id, title, description, skills, link, next) => {
    let project = new Project({
        teacher: teacher_id,
        title: title,
        description: description,
        skills: skills,
        link: link
    });
    project.save(next);
}

module.exports.fetchProjectById = (id, next) => {
    Project.findOne({_id: id}).populate([
        {
            path: 'students',
            model: 'Student'
        },
        {
            path: 'requests',
            model: 'Student'
        },
        {
            path: 'teacher',
            model: 'Teacher'
        },
        {
            path: 'skills',
            model: 'Skill'
        }
    ]).exec(next);
}

module.exports.fetchProjectsByTeacherId = (teacher_id, next) => {
    Project.find({teacher: teacher_id}).populate([
        {
            path: 'students',
            model: 'Student'
        },
        {
            path: 'requests',
            model: 'Student'
        },
        {
            path: 'teacher',
            model: 'Teacher'
        },
        {
            path: 'skills',
            model: 'Skill'
        }
    ]).exec(next);
}

module.exports.addARequest = (project_id, student_id, next) => {
    Project.findOneAndUpdate({_id: project_id}, {$addToSet: {requests: student_id}}).exec(next);
}

module.exports.removeARequest = (project_id, student_id, next) => {
    Project.findOneAndUpdate({_id: project_id}, {$pull: {requests: student_id}}).exec(next);
}

module.exports.addAStudent = (project_id, student_id, next) => {
    Project.findOneAndUpdate({_id: project_id}, {$addToSet: {students: student_id}}).exec(next);
}

module.exports.fetchAllProjects = (next) => {
    Project.find({}).populate([
        {
            path: 'students',
            model: 'Student'
        },
        {
            path: 'requests',
            model: 'Student'
        },
        {
            path: 'teacher',
            model: 'Teacher'
        },
        {
            path: 'skills',
            model: 'Skill'
        }
    ]).exec(next);
}

module.exports.fetchProjectsWithUnapprovedRequests = (user_id, next) => {
    Project.find({'requests': user_id}).populate([
        {
            path: 'students',
            model: 'Student'
        },
        {
            path: 'requests',
            model: 'Student'
        },
        {
            path: 'teacher',
            model: 'Teacher'
        },
        {
            path: 'skills',
            model: 'Skill'
        }
    ]).exec(next);
}

module.exports.fetchProjectsWithApproved = (user_id, next) => {
    Project.find({'students': user_id}).populate([
        {
            path: 'students',
            model: 'Student'
        },
        {
            path: 'requests',
            model: 'Student'
        },
        {
            path: 'teacher',
            model: 'Teacher'
        },
        {
            path: 'skills',
            model: 'Skill'
        }
    ]).exec(next);
}