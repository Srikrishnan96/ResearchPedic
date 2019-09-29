const User = require('../models/Users');
const getDb = require('../utilities/database').getDb;
const ObjectId = require('mongodb').ObjectId;

exports.postUserSignup = function(req, res, next) {
    User.userValidationCreation(req.body);
    res.redirect('/');
}

exports.register = function(req, res) {
    let registeredStudies = req.session.user.registeredStudies?req.session.user.registeredStudies:[];
    registeredStudies.push(req.body.regPostId);
    const db = getDb();
    db.collection('users')
    .updateOne({ _id: new ObjectId(req.session.user._id) }, { $set: {registeredStudies: registeredStudies} })
    .catch(function(err) {
        throw err;
    });
    res.redirect('/all-researches');
}

exports.cancelRegistration = function(req, res) {
    let studyId = req.body.cancelPostId
    let registeredStudies = req.session.user.registeredStudies;
    const studyIndex = registeredStudies.findIndex(function(id) {
        return id == studyId;
    });
    registeredStudies.splice(studyIndex, 1);
    const db = getDb();
    db.collection('users').updateOne({_id: new ObjectId(req.session.user._id)}, {$set: {registeredStudies: registeredStudies}});
    if(req.body.prevPath) {
        return res.redirect('/user/my-surveys')
    }
    res.redirect('/all-researches');
}

exports.showMyRegistrations = function(req, res) {
    req.session.user.myRegistrations()
    .then(studies => {
        const registeredStudies = [];
        studies.forEach(element => {
            registeredStudies.push(element.id);
        });
        res.render('studies/all-posts', {
            studies: studies,
            pageTitle: 'Research Studies',
            prevPath: req.originalUrl,
            loggedInUser: req.session.user,
            registeredStudies: registeredStudies
        });
    });
}