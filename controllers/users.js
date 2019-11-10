const User = require('../models/Users');
const Study = require('../models/Study');
const Admin = require('../models/Admin');
const sendGrid = require('@sendgrid/mail');

exports.getUserLogin = function(req, res) {
    res.render('users/login-signup', {
        pageTitle: 'User Login-Signup',
        path: '/user/login',
        loggedInUser: null,
        loginIdFill: req.query.email?req.query.email:''
    });
}

exports.postUserLogout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/all-researches');
    });
}

exports.register = function(req, res, next) {
    let registeredStudies = req.session.user.registeredStudies?req.session.user.registeredStudies:[];
    registeredStudies.push(req.body.regPostId);
    User.updateOne({ _id: req.session.user_id }, { $set: {registeredStudies: registeredStudies} })
        .then(function() {
            res.redirect(`/all-researches`);
            return Study.findById({_id: req.body.regPostId});
        })
        .then(function(currentRegistered) {
            return Admin.findById({_id: currentRegistered.studyAdmin});
        })
        .then(function(admin) {
            const msg = {
                to: `${admin.email}`,
                from: 'noreply@research-pedic.com',
                subject: 'Re. New Application for Study',
                text: 'and easy to do anywhere, even with Node.js',
                html: `
                <!DOCTYPE html>
                <html lang="en">
                    <style>
                        .center { text-align: center }
                    </style>
                    <body>
                        <h1 class='center'>Hello Mr.Admin!!!</h1>
                        <div class='center'>
                            <p>We got a new Lab rat for you</p>
                            <p>Catch her/him here ${req.session.user.email}</p>
                            <p>Hope you research goes well</p>
                        <div> 
                        <p>Best Wishes</p>
                        <p>Research-pedic</p>
                    </body>
                </html>
                `,
              };
            sendGrid.setApiKey('###############');
            sendGrid.send(msg);
        })
        .catch(function(err) {
            throw err;
        });
}

exports.cancelRegistration = function(req, res) {
    let studyId = req.body.cancelPostId
    let registeredStudies = req.session.user.registeredStudies;
    const studyIndex = registeredStudies.findIndex(function(id) {
        return id == studyId;
    });
    registeredStudies.splice(studyIndex, 1);
    User.updateOne({_id: req.session.user._id}, {$set: {registeredStudies: registeredStudies}})
    .then(function(result) {
        if(req.body.prevPath) {
            return res.redirect('/user/my-surveys');
        }
        res.redirect(`/all-researches`);
    }).catch(function(err) {
        console.log(err);
    })
}

exports.showMyRegistrations = function(req, res) {
    User.findById({_id: req.session.user_id})
        .populate('registeredStudies')
        .then(function(user) {
            const registeredStudyId = user.registeredStudies.map(function(study) {
                return study._id;
            });
            res.render('studies/all-posts', {
                studies: user.registeredStudies,
                pageTitle: 'Research Studies',
                prevPath: req.originalUrl,
                loggedInUser: req.session.user,
                registeredStudies: registeredStudyId
            });
    });
}
