const express = require('express');
const router = express.Router();
const productController = require('../controller/productControllers');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/create', authenticate, productController.createProduct);
router.get('/get-product/:id', authenticate, productController.getProductById);
router.get('/get-all-products', authenticate, productController.getAllProductBySeller);
router.delete('/delete/:id', authenticate, productController.deleteProduct);
router.put('/update/:id', authenticate, productController.updateProduct);
router.get('/get-public-product/:id', productController.getPublicProductById);
router.get('/get-filter-products', productController.getProductsByFilter);
router.get('/get-all-public-products', productController.getPublicAllProducts);

module.exports = router;
