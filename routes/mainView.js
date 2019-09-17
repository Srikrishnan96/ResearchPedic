const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('mainPage/entry-view', {
        pageTitle: 'MainPage',
        loggedInUser: null
    });
});

module.exports = router;