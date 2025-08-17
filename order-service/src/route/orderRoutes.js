const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderControllers');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/create', authenticate, orderController.createOrder);
router.get('/get-orders', authenticate, orderController.getOrderByUser);

module.exports = router;