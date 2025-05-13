const express = require('express');
const router = express.Router();
const refrigeratorController = require('../controllers/refrigeratorController');
const checkRole = require('../middlewares/checkRole');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), refrigeratorController.getRefrigerators);
router.get('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.getRefrigeratorById);
router.post('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.addRefrigerator);
router.put('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.updateRefrigerator);
router.delete('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.deleteRefrigerator);
router.get('/user/:userId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.getRefrigeratorsByUser);
router.get('/location/:location', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.getRefrigeratorsByLocation);
router.get('/:id/last-update', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), refrigeratorController.getRefrigeratorLastUpdate);
module.exports = router;
