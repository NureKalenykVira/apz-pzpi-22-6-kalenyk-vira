const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const checkRole = require('../middlewares/checkRole');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, checkRole(['RegularUser', 'GlobalAdmin']), notificationController.getNotifications);
router.get('/:id', authenticateToken, checkRole(['RegularUser', 'GlobalAdmin']), notificationController.getNotificationById);
router.post('/', authenticateToken, checkRole(['LogicAdmin']), notificationController.addNotification);
router.patch('/:id/status', authenticateToken, checkRole(['RegularUser']), notificationController.updateNotificationStatus);
router.delete('/:id', authenticateToken, checkRole(['GlobalAdmin']), notificationController.deleteNotification);
router.get('/user/:userId', authenticateToken, checkRole(['RegularUser', 'GlobalAdmin']), notificationController.getNotificationsByUser);

module.exports = router;