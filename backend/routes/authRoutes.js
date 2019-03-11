const express = require('express');

const authController = require('../controllers/authController');
const router = express.Router();

// Route for registering a student
router.post('/student/register', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let contact = req.body.contact;

    authController.registerStudent(name, username, email, password, contact).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

// Route for registering a teacher
router.post('/teacher/register', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let contact = req.body.contact;
    let skills = req.body.skills;

    authController.registerTeacher(name, username, email, password, contact, skills).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

// Route for logging in a student
router.post('/student/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    authController.loginStudent(email, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

// Route for logging in a teacher
router.post('/teacher/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    authController.loginTeacher(email, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

// Route for checking a teacher's existense
router.post('/teacher/check', (req, res) => {
    let email = req.body.email;
    let username = req.body.username;

    authController.checkTeacherExistense(email, username)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

module.exports = router;

