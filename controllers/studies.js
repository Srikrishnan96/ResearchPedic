const Study = require('../models/Study');
const getDb = require('../utilities/database').getDb;

exports.showStudies = function(req, res) {
    Study.showAll().then(studies => res.render('studies/all-posts', {
        studies: studies,
        pageTitle: 'Research Studies',
        path: '/all-researches',
        loggedInUser: req.session.user,
        registeredStudies: req.session.user?req.session.user.registeredStudies:[],
        prevPath: null
    }));
}

exports.researchDetails = function(req, res) {
    var loggedUser = null;
    if(req.session.user){
        loggedUser = req.session.user;
    }
    const db = getDb();
    db.collection('researchStudies').findOne({id: req.params.postId}).then(study =>{
        res.render('studies/post-details', {
            study: study,
            pageTitle: 'Research Studies',
            path: '/all-researches/',
            loggedInUser: loggedUser,registeredStudies: req.session.user?req.session.user.registeredStudies:[]
        });
    });
}