const express = require('express');
const usersController = require('../controllers/users');
const authController = require('../controllers/auth');
const router = express.Router();

const routeLoginValidation = function(req, res, next) {
    if(req.session.user){
        next();
    }
    else {
        res.redirect('/user/login');
    }
}

router.get('/my-surveys', routeLoginValidation, usersController.showMyRegistrations);

router.get('/login', usersController.getUserLogin);

router.post('/login', authController.postUserLogin);

router.post('/logout', usersController.postUserLogout);

router.post('/signup', authController.postUserSignup);

router.post('/register', routeLoginValidation, usersController.register);

router.post('/cancel', usersController.cancelRegistration);

module.exports = router;