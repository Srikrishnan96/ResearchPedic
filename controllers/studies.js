const Study = require('../models/Study');
const User = require('../models/Users');

exports.showAllStudies = function(req, res,next) {
    Study.find()
        .then(function(studies) {
            res.render('studies/all-posts', {
                studies: studies,
                pageTitle: 'Research Studies',
                path: '/all-researches',
                loggedInUser: req.session.user_id,
                registeredStudies: req.session.user?req.session.user.registeredStudies:[],
                prevPath: null
            });
        })
        .catch(function(err) {
            console.log(err);
        })
}

exports.studyDetails = function(req, res, next) {
    let loggedUser = null, registered = false;
    console.log(req.session.user);
    if(req.session.user_id){
        loggedUser = req.session.user;
    }
    Study.findOne({_id: req.params.postId})
        .then(function(study) {
            if(req.session.user.registeredStudies.find(function(regStudy) {
                return study._id.toString() === regStudy._id.toString()
            })) registered=true;
            return study;
        })
        .then(study => {
            res.render('studies/post-details', {
                study: study,
                pageTitle: 'Research Studies',
                path: '/all-researches/',
                loggedInUser: loggedUser,
                registered: registered
            });
        })
        .catch(function(err) {
            console.log(err);
        })
}