const getDb = require('../utilities/database').getDb;

exports.getUserLogin = function(req, res) {
    res.render('users/login-signup', {
        pageTitle: 'User Login-Signup',
        path: '/user/login',
        loggedInUser: null
    });
}

exports.postUserLogin = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const db = getDb();
    db.collection('users').findOne({email: email}).then(user => {
        if(user && user.password === password) {
            const {_id} = user;
            req.session.user_id = _id;
            res.redirect('/all-researches');
        } else {
            console.log('Username or Password Invalid');
            res.redirect('/user/login');
        }
    }).catch(function(err) {
        throw err;
    })
}

exports.postUserLogout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/all-researches');
    });
}

exports.getAdminLogin = function(req, res) {
    res.render('admin/login-signup', {
        pageTitle: 'Admin Login-Signup',
        path: '/admin/login',
        loggedInUser: null
    })
}

exports.postAdminLogin = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const db = getDb();
    db.collection('adminUser').findOne({email: email})
    .then(admin => {
        if(admin && admin.password === password) {
            const {_id} = admin;
            req.session.admin_id = _id;
            res.redirect('/admin/research-posts');
        } else {
            console.log('Username or Password Invalid');
            res.redirect('/user/login');
        }
    })
    .catch(function(err) {
        throw err;
    });
}

exports.postAdminLogout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
}