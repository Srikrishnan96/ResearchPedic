const Study = require('../models/Study');
const Admin = require('../models/Admin');

exports.getAdminLogin = function(req, res) {
    res.render('admin/login-signup', {
        pageTitle: 'Admin Login-Signup',
        path: '/admin/login',
        loggedInUser: null,
        loginIdFill: req.query.email?req.query.email:''
    });
}

exports.postAdminLogout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
}

exports.postStudyForm = function(req, res, next) {
    const {subject, location, gender, age, payout, expiry, description, study_id} = req.body;
    const { admin_id } = req.session;
    if(study_id) {
        Study.findById(study_id)
        .then(function(study) {
            study.gender = gender;
            study.age = age;
            study.payout = payout;
            study.expiry = expiry;
            study.description = description;
            return study.save();
        }).then(function() {
            res.redirect('/admin/research-posts');
        }).catch(function(err) {
            throw err;
        });
    }
    else {
        let study_id;
        newStudy = new Study({subject, location, gender, age, payout, expiry, description, studyAdmin: req.session.admin_id, published: new Date()});
        newStudy.save()
        .then(function(study) {
            study_id = study._id;
            return Admin.findById({_id: admin_id});
        }).then(function(result) {
            result.postedStudies.unshift(study_id);
            return result.save();
        }).then(function() {
            res.redirect('/admin/research-posts');
        }).catch(function(err) {
            console.log(err);
        });
    }
}

exports.getStudyForm = function(req, res) {
    res.render('admin/study-form', {
        pageTitle: 'Post Research Study', 
        study: null
    });
}

exports.researchPosts = function(req, res) {
    Admin.findById({_id: req.session.admin_id})
        .populate('postedStudies')
        .then(function(admin) {
            res.render('admin/research-posts', {
                pageTitle: 'Admin-Study-Posts', 
                loggedInUser: req.session.admin,
                postedStudies: admin.postedStudies
            });
        }).catch(function(err) {
            console.log(err);
        })
}

exports.editStudy = function(req, res) {
    const studyId = req.body.studyId;
    Study.findById(studyId).then(study => {
        res.render('admin/study-form', {
            pageTitle: 'Edit-Study',
            study: study
        });
    });
}

exports.deleteStudy = function(req, res) {
    Study.deleteOne({_id: req.body.studyId})
        .then(function() {
            return Admin.findById({_id: req.session.admin_id})
        }).then(function(admin) {
            const removedStudyIndex = admin.postedStudies.findIndex(function(studyId) {
                return studyId.toString() === req.body.studyId.toString();
            });
            admin.postedStudies.splice(removedStudyIndex, 1);
            return admin.save()
        }).then(function() {
            res.redirect('/admin/research-posts');
        }).catch(function(err) {
            console.log(err);
        });
}