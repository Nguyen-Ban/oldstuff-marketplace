const express = require('express');
const router = express.Router();
const blindboxController = require('../controller/blindboxControllers');
const blindboxMiddleware = require('../middleware/blindboxMiddleware');

router.post('/create', blindboxMiddleware.authenticate, blindboxController.createBlindBox);
router.post('/pick/:blindBoxId', blindboxMiddleware.authenticate, blindboxController.pickFromBlindBox);

module.exports = router;
