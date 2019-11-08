const Admin = require('../models/Admin');
const User = require('../models/Users');

exports.postUserLogin = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email}).then(user => {
        if(user && user.password === password) {
            console.log('User found and session set');
            const {_id} = user;
            req.session.user_id = _id;
            res.redirect('/all-researches');
        } else {
            console.log('Username or Password Invalid');
            res.redirect('/user/login');
        }
    }).catch(function(err) {
        throw err;
    });
}

exports.postUserSignup = function(req, res) {
    const {userName, email, password, passwordConfirm} = req.body;
    Admin.findOne({email: email})
    .then(function(admin) {
        if(admin) {
            console.log('User already exists');
            res.redirect('/user/login')
        }
        else {
            if(password == passwordConfirm){
                admin = new Admin({name: userName, email: email, password: password});
                admin.save();
                res.redirect('/user/login/?email='+email);
            }
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

exports.postAdminLogin = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    Admin.findOne({email: email})
    .then(function(admin) {
        if(admin && admin.password === password) {
            const {_id} = admin;
            req.session.admin_id = _id;
            res.redirect('/admin/research-posts');
        } else {
            console.log('Admin login credential are wrong');
            res.redirect('/admin/login-signup');
        }
    })
    .catch(function(err) {
        throw err;
    });
}

exports.postAdminSignup = function(req, res) {
    const {userName, email, password, passwordConfirm} = req.body;
    Admin.findOne({email: email})
    .then(function(admin) {
        if(admin) {
            console.log('Admin already exists');
            res.redirect('/admin/login-signup');
        }
        else {
            if(password == passwordConfirm){
                admin = new Admin({name: userName, email: email, password: password});
                admin.save();
                res.redirect('/admin/login-signup/?email='+email);
            }
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}