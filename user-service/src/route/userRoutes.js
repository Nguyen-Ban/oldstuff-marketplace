const express = require('express');
const router = express.Router();
const userController = require('../controller/userControllers');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/upgrade', authenticate, userController.upgradeToSeller);
router.get('/verify-user', userController.verifyUser);

module.exports = router;