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
            const {userName, password, email, registeredStudies, _id} = user;
            req.session.user = {userName, password, email, _id, registeredStudies};
            res.redirect('/all-researches');
        } else {
            console.log('Username or Password Invalid');
            res.redirect('/user/login');
        }
    }).catch(err => {
        console.log(err);
    })
}

exports.postUserLogout = function(req, res) {
    delete req.session.user;
    delete req.session.isLoggedIn;
    res.redirect('/');
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
            const {userName, password, email, postedStudies, _id} = admin;
            req.session.admin = {userName, email, password, postedStudies, _id};
            res.redirect('/admin/research-posts');
        } else {
            console.log('Username or Password Invalid');
            res.redirect('/user/login');
        }
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postAdminLogout = function(req, res) {
    delete req.session.admin;
    delete req.session.adminIsLoggedIn;
    res.redirect('/');
}