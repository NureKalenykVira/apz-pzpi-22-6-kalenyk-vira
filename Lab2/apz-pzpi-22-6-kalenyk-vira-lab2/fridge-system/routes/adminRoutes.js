const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const asyncHandler = require('../middlewares/asyncHandler');
const adminController = require('../controllers/adminController');

const router = express.Router();

// GlobalAdmin 
router.get('/configurations', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.getConfigurations));
router.put('/configurations', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.updateConfiguration));
router.get('/general-report', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.generateGeneralReport));

router.get('/algorithm-settings', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.getAlgorithmSettings));
router.put('/algorithm-settings', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.updateAlgorithmSettings));
router.get('/users', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.getAllUsers));
router.delete('/users/:id', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.deleteUser));
router.get('/api-status', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.monitorAPIStatus));
router.put('/users/role', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.changeUserRole));
router.get('/logs', authenticateToken, checkRole(['GlobalAdmin']), asyncHandler(adminController.getAdminLogs));

//  BusinessLogicAdmin 
router.get('/sensor-thresholds', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.getSensorThresholds));
router.put('/sensor-thresholds', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.updateSensorThresholds));
router.get('/report-settings', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.getReportSettings));
router.put('/report-settings', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.updateReportSettings));

// Управління правилами сповіщень
router.get('/notification-rules', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.getNotificationRules));
router.post('/notification-rules', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.createNotificationRule));
router.put('/notification-rules/:id', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.updateNotificationRule));
router.delete('/notification-rules/:id', authenticateToken, checkRole(['GlobalAdmin', 'BusinessLogicAdmin']), asyncHandler(adminController.deleteNotificationRule));

// ServiceAdmin
router.get('/db/performance', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.analyzePerformance));
router.get('/sensors/history/:sensorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.getSensorHistory));
router.post('/sensors/history', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.addSensorHistory));
router.get('/sensors/anomalies/:sensorId', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.getAnomalousData));
router.post('/sensors/anomalies', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.addAnomalousData));
router.get('/iot-devices', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.monitorIoTDevices));
router.post('/iot-devices/restart/:id', authenticateToken, checkRole(['GlobalAdmin', 'ServiceAdmin']), asyncHandler(adminController.restartIoTDevice));

//  InfrastructureAdmin 
router.post('/db/backup', authenticateToken, checkRole(['GlobalAdmin', 'InfrastructureAdmin']), asyncHandler(adminController.createDatabaseBackup));
router.post('/db/restore', authenticateToken, checkRole(['GlobalAdmin', 'InfrastructureAdmin']), asyncHandler(adminController.restoreBackup));
router.post('/db/access', authenticateToken, checkRole(['GlobalAdmin', 'InfrastructureAdmin']), asyncHandler(adminController.manageAccess));
router.post('/db/migrate', authenticateToken, checkRole(['GlobalAdmin', 'InfrastructureAdmin']), asyncHandler(adminController.migrateDatabase));

module.exports = router;