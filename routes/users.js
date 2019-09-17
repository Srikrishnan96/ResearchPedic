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
// router.post('/my-surveys', usersController.mySurveys);

router.get('/my-surveys', routeLoginValidation, usersController.showmySurveys);

router.get('/login', authController.getUserLogin);

router.post('/login', authController.postUserLogin);

router.post('/logout', authController.postUserLogout);

// router.get('/signup', usersController.userSignUp);

router.post('/signup', usersController.postUserSignup);

router.post('/register', routeLoginValidation, usersController.registerStudy)

router.post('/cancel', usersController.cancelStudy)

module.exports = router;