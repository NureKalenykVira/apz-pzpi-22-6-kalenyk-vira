const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

let anomalies = [];

router.post('/sensors/anomalies', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), (req, res) => {
    const { zoneId, anomalies: detectedAnomalies } = req.body;
    console.log('Anomalies received from client:', req.body);
    if (!zoneId || !detectedAnomalies || !Array.isArray(detectedAnomalies)) {
        return res.status(400).json({ message: 'Invalid anomalies data.' });
    }
    anomalies.push({ zoneId, detectedAnomalies, timestamp: new Date() });
    console.log(`Anomalies logged for zone ${zoneId}:`, detectedAnomalies);
    res.status(200).json({ message: 'Anomalies logged successfully.' });
});

module.exports = router;
