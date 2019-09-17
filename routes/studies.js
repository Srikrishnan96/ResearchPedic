const express = require('express');
const studiesController = require('../controllers/studies');
const router = express.Router();

//router.get('/:username', studiesController.showStudies)

router.get('/:postId', studiesController.researchDetails);

router.get('/', studiesController.showStudies);

module.exports = router;
