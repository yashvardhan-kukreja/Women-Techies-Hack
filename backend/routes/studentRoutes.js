const StudentController = require('../controllers/studentController');
const router = require('express').Router();


try {
    var config = require('../config');
} catch (e) {
    console.log("Unable to access config variables");
}

const secret = process.env.SECRET || config.SECRET;

router.use((req, res, next) => {
    let token = req.headers['x-access-token'];
    StudentController.verifyToken(token, secret).then(data => {
        req.decoded = data;
        next();
    }).catch(err => res.json(err));
});

router.get('/fetchDetails', (req, res) => {
    StudentController.fetchDetails(req.decoded._id).then(data => res.json(data)).catch(err => res.json(err));
});

router.get('/teachers', (req, res) => {
    StudentController.fetchAllTeachers().then(data => res.json(data)).catch(err => res.json(err));
});

router.post('/favorTeacher', (req, res) => {
    let teacher_id = req.body.teacher_id;
    let student_id = req.decoded._id;
    let skill_id = req.body.skill_id;
    StudentController.favorTeacher(student_id, teacher_id, skill_id).then(data => res.json(data)).catch(err => res.json(err));
});

router.get('/favoriteTeachers', (req, res) => {
    let student_id = req.decoded._id;
    StudentController.fetchFavTeachers(student_id).then(data => res.json(data)).catch(err => res.json(err));
});

router.post("/unfavorTeacher", (req, res) => {
    let student_id = req.decoded._id;
    let teacher_id = req.body.teacher_id;
    let skill_id = req.body.skill_id;
    StudentController.unfavorTeacher(student_id, teacher_id, skill_id).then(data => res.json(data)).catch(err => res.json(err));
});

router.post("/unfavorTeacherById", (req, res) => {
    let fav_id = req.body.fav_id;
    StudentController.unfavorTeacherById(fav_id).then(data => res.json(data)).catch(err => res.json(err));
});


router.get("/project/all", (req, res) => {
    StudentController.fetchAllProjects()
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.post("/project/request", (req, res) => {
    let student_id = req.decoded._id;
    let project_id = req.body.project_id;
    StudentController.requestForAProject(student_id, project_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.get("/project/unapproved", (req, res) => {
    let student_id = req.decoded._id;
    StudentController.fetchProjectsWithMyUnapprovedRequests(student_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.get("/project/approved", (req, res) => {
    let student_id = req.decoded._id;
    StudentController.fetchProjectsWithMyApprovedRequests(student_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});


module.exports = router;