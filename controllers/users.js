const User = require('../models/Users');
const Study = require('../models/Study');
const getDb = require('../utilities/database').getDb;
const ObjectId = require('mongodb').ObjectId;

exports.userLoggedIn = function(req, res, next) {
    User.userValidationCreation(req.body, function(allusers, {userName, password}) {
        var user = allusers[userName]
        if(user && user.password === password) {
            console.log('user exists');
            Study.showAll(studies => {
                res.render('studies/all-posts', {
                    studies: studies,
                    pageTitle: 'Research Studies',
                    path: '/all-researches',
                    loggedInUser: userName,
                    prevPath: null
                });
            });
        }
        else {
            console.log('Username or password is wrong');
            res.redirect('users/login-signup');
        }
    });
}

exports.postUserSignup = function(req, res, next) {
    User.userValidationCreation(req.body);
    res.redirect('/');
}

exports.registerStudy = function(req, res) {
    console.log(req.session.user.mySurveys);
    let registeredStudies = req.session.user.registeredStudies?req.session.user.registeredStudies:[];
    registeredStudies.push(req.body.regPostId);
    const db = getDb();
    db.collection('users').updateOne({ _id: new ObjectId(req.session.user._id) }, { $set: {registeredStudies: registeredStudies} });
    res.redirect('/all-researches');
}

exports.cancelStudy = function(req, res) {
    console.log(req.body.prevPath);
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

exports.showmySurveys = function(req, res) {
    req.session.user.mySurveys()
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