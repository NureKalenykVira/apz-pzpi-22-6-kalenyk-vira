const express = require('express');
const router = express.Router();
const {
    getThresholdsHandler,
    updateThresholdsHandler,
    getIntervalHandler,
    updateIntervalHandler,
} = require('../controllers/settingsController');
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/thresholds', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), getThresholdsHandler);
router.post('/thresholds', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), updateThresholdsHandler);
router.get('/interval', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), getIntervalHandler);
router.post('/interval', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), updateIntervalHandler);

module.exports = router;
