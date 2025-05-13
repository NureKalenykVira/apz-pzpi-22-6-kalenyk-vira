const notificationRepository = require('../repositories/notificationRepository');

// Отримати всі сповіщення
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationRepository.getNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Отримати сповіщення за ID
const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await notificationRepository.getNotificationById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

// Додати нове сповіщення
const addNotification = async (req, res) => {
  const { userId, dataId, message, status } = req.body;
  try {
    const result = await notificationRepository.addNotification(userId, dataId, message, status);
    res.status(201).json({ notificationId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add notification' });
  }
};

// Оновити статус сповіщення
const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await notificationRepository.updateNotificationStatus(id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification status' });
  }
};

// Видалити сповіщення
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await notificationRepository.deleteNotification(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Отримати сповіщення за користувачем
const getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await notificationRepository.getNotificationsByUser(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications for user' });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  addNotification,
  updateNotificationStatus,
  deleteNotification,
  getNotificationsByUser,
};
