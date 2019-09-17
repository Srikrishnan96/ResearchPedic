const Study = require('../models/Study');
const Admin = require('../models/Admin');
const ObjectId = require('mongodb').ObjectId;

exports.postStudyForm = function(req, res) {
    const { subject, location, gender, age, payout, expiry, description, m_id} = req.body;
    obj = new Study(subject, location, gender, age, payout , expiry, description, req.session.admin._id, m_id);
    obj.saveStudy(req.session.admin);
    res.redirect('/admin/research-posts');
}

exports.getStudyForm = function(req, res) {
    res.render('admin/post-form', {pageTitle: 'Post Research Study', study: null});
}

exports.researchPosts = function(req, res) {
    console.log(req.session.adminIsLoggedIn);
        //const postedStudies = req.session.admin.postedStudies
        res.render('admin/research-posts', {
            pageTitle: 'Admin-Study-Posts', loggedInUser: req.session.admin,
            postedStudies: req.session.admin.postedStudies
        });
}

exports.editStudy = function(req, res) {
    const studyId = req.body.studyId;
    Study.findById(studyId).then(study => {
        console.log(study);
        res.render('admin/post-form', {
            pageTitle: 'Edit-Study',
            study: study
        });
    });
}

exports.deleteStudy = function(req, res) {
    const studyId = req.body.studyId;
    Study.deleteById(studyId, req.session.admin).then(() => {
        res.redirect('/admin/research-posts');
    });
}