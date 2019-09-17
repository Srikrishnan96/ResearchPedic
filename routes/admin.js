const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const authController = require('../controllers/authentication');

const routeLoginValidation = function(req, res, next) {
    console.log(req.session.admin);
    if(req.session.admin){
        next();
    }
    else {
        res.redirect('/admin/login-signup');
    }
}

router.get('/post-study', routeLoginValidation, adminController.getStudyForm);

router.post('/post-study', adminController.postStudyForm);

router.get('/research-posts', routeLoginValidation, adminController.researchPosts);

router.get('/login-signup', authController.getAdminLogin);

router.post('/login-signup', authController.postAdminLogin);

router.post('/logout', authController.postAdminLogout);

router.post('/edit-study', adminController.editStudy);

router.post('/delete-study', adminController.deleteStudy);

module.exports = router;