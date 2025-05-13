const express = require('express');
const router = express.Router();
const { getZones } = require('../controllers/zonesController');
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/zones', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin', 'User']), getZones);

module.exports = router;