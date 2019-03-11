const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const authRouter = require('./routes/authRoutes');
const studentRouter = require('./routes/studentRoutes');
const teacherRouter = require('./routes/teacherRoutes').router;
const teacherRouterUntoken = require('./routes/teacherRoutes').untoken_router;
const SkillTransactions = require('./database/skill/skillTransactions');

try {
    var config = require('./config');
} catch (e) {
    console.log("Unable to access config variables");
}

const DB = process.env.DB || config.DB;
const port = process.env.PORT || 8000;
const app = express();

// Setting up connection to the database
mongoose.connect(DB, err => {
    if (err)
        console.log("Error occurred while connecting to the database ! ");
    else {
        console.log("Connection established to the database...");

        // Attaching body parser for reading request bodies
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        // Attaching a logger to the project
        app.use(logger('dev'));

        // Attaching "helmet" to the project to secure various HTTP headers
        // Attaching "compression" to the project to compress the requests passing through middlewares
        app.use(helmet());
        app.use(compression());

        // Attaching the routers to specific base routes
        app.use('/authenticate', authRouter);
        app.use('/student', studentRouter);
        app.use('/teacher', teacherRouter);
        app.use('/untoken/teacher', teacherRouterUntoken);

        app.post('/addskill', (req, res) => {
            let name = req.body.skill;
            SkillTransactions.addASkill(name, (err) => {
                if (err) {
                    console.error(err);
                    if (err.code === 11000)
                        res.json({success: false, message: "A skill already exists with the same name"});
                    else
                        res.json({success: false, message: "An error occurred"});

                } else {
                    res.json({success: true, message: `${name} successfully added as a skill`});
                }
            });
        });

        // Setting up the error handler
        app.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        app.use((err, req, res, next) => {
            res.locals.message = err.message;
            console.log(err);
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.send('error');
        });

        // Starting the server on the specified port
        app.listen(port, () => {
            console.log("App running successfully on port number: " + port + "...");
        });
    }
});