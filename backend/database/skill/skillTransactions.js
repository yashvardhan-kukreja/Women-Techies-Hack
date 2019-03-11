const Skill = require('./skillModel');

module.exports.fetchAllSkills = (next) => {
    Skill.find({}).exec(next);
};

module.exports.addASkill = (skill, next) => {
    let newSkill = new Skill({
        name: skill
    });

    newSkill.save(next);
};