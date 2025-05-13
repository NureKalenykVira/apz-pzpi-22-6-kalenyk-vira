const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { recommendConsumptionDate } = require('../business-logic/calculateRecommendedConsumptionDate');
const { notifyNearExpiration } = require('../business-logic/notifyNearExpiration');
const { notifyExpiration } = require('../business-logic/notifyExpiration');
const checkRole = require('../middlewares/checkRole');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/notify-expiration', authenticateToken, checkRole(['LogicAdmin']), notifyExpiration);
router.post('/notify-near-expiration', authenticateToken, checkRole(['LogicAdmin']), notifyNearExpiration);
router.get('/recommended-consumption-date/:productId', authenticateToken, checkRole(['User', 'LogicAdmin']), recommendConsumptionDate);
router.get('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.getProducts);
router.get('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.getProductById);
router.post('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.addProduct);
router.put('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.updateProduct);
router.delete('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.deleteProduct);
router.get('/refrigerator/:refrigeratorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.getProductsByRefrigerator);
router.get('/category/:category', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), productController.getProductsByCategory);

module.exports = router; 