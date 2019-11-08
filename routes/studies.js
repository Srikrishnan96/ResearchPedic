const express = require('express');
const studiesController = require('../controllers/studies');
const router = express.Router();

//router.get('/:username', studiesController.showAllStudies)

router.get('/:postId', studiesController.studyDetails);

router.get('/', studiesController.showAllStudies);

module.exports = router;
