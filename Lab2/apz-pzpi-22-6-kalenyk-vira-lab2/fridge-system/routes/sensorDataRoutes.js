const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const sensorDataController = require('../controllers/sensorDataController');
const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.getSensorData);
router.get('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.getSensorDataById);
router.post('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.addSensorData);
router.put('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.updateSensorData);
router.delete('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.deleteSensorData);
router.get('/sensor/:sensorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.getSensorDataBySensor);
router.get('/product/:productId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.getSensorDataByProduct);
router.get('/date', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorDataController.getSensorDataByDate);

module.exports = router;