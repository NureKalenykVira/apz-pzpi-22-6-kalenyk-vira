const express = require('express');
const router = express.Router();
const db = require('../db');
const sensorController = require('../controllers/sensorController');
const { handleAnomalousData } = require('../business-logic/handleAnomalousData');
const { analyzeStorageHandler } = require('../business-logic/analyzeStorageConditions');
const checkRole = require('../middlewares/checkRole');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/analyze-storage-conditions/:sensorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), analyzeStorageHandler);
router.post('/handle-anomalous-data', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), handleAnomalousData);
router.get('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.getSensors);
router.get('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.getSensorById);
router.post('/', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.addSensor);
router.put('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.updateSensor);
router.delete('/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.deleteSensor);
router.get('/refrigerator/:refrigeratorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.getSensorsByRefrigerator);
router.patch('/:id/status', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.updateSensorStatus);
router.get('/type/:type', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), sensorController.getSensorsByType);

router.post('/data', async (req, res) => {
    console.log('Request received: POST /sensors/data');
    console.log('Data:', req.body);

    try {
        await db.query(
            'INSERT INTO SensorData (SensorID, Temperature, Humidity, Timestamp) VALUES (?, ?, ?, ?)',
            [req.body.sensorId, req.body.temperature, req.body.humidity, new Date()]
        );
        res.status(200).send({ message: 'Data saved successfully.' });
    } catch (error) {
        console.error('Error saving data to database:', error.message);
        res.status(500).send({ message: 'Error saving data.' });
    }
});

module.exports = router;