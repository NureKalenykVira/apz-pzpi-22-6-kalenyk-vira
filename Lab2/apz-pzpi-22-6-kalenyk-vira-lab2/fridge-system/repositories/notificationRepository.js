const db = require('../db');

// Отримати всі сповіщення
const getNotifications = async () => {
  const [rows] = await db.query('SELECT * FROM Notifications');
  return rows;
};

// Отримати сповіщення за ID
const getNotificationById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Notifications WHERE NotificationID = ?', [id]);
  return rows[0];
};

// Додати нове сповіщення
const addNotification = async (userId, dataId, message, status) => {
  const [result] = await db.query(
    'INSERT INTO Notifications (UserID, DataID, Message, Status) VALUES (?, ?, ?, ?)',
    [userId, dataId, message, status]
  );
  return result;
};

// Оновити статус сповіщення
const updateNotificationStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE Notifications SET Status = ?, CreatedAt = CURRENT_TIMESTAMP WHERE NotificationID = ?',
    [status, id]
  );
  return result;
};

// Видалити сповіщення
const deleteNotification = async (id) => {
  const [result] = await db.query('DELETE FROM Notifications WHERE NotificationID = ?', [id]);
  return result;
};

// Отримати сповіщення за користувачем
const getNotificationsByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM Notifications WHERE UserID = ?', [userId]);
  return rows;
};

module.exports = {
  getNotifications,
  getNotificationById,
  addNotification,
  updateNotificationStatus,
  deleteNotification,
  getNotificationsByUser,
};