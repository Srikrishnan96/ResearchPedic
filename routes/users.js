const express = require('express');
const usersController = require('../controllers/users');
const authController = require('../controllers/authentication');
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

router.get('/login', authController.getUserLogin);

router.post('/login', authController.postUserLogin);

router.post('/logout', authController.postUserLogout);

router.post('/signup', usersController.postUserSignup);

router.post('/register', routeLoginValidation, usersController.register);

router.post('/cancel', usersController.cancelRegistration);

module.exports = router;