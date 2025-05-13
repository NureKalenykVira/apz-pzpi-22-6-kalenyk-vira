const db = require('../db');

// Отримати всі записи даних сенсорів
const getSensorData = async () => {
  const [rows] = await db.query('SELECT * FROM SensorData');
  return rows;
};

// Отримати дані за ID
const getSensorDataById = async (id) => {
  const [rows] = await db.query('SELECT * FROM SensorData WHERE DataID = ?', [id]);
  return rows[0];
};

// Додати нові дані сенсора
const addSensorData = async (sensorId, productId, temperature, humidity, timestamp) => {
  const [result] = await db.query(
    'INSERT INTO SensorData (SensorID, ProductID, Temperature, Humidity, Timestamp) VALUES (?, ?, ?, ?, ?)',
    [sensorId, productId, temperature, humidity, timestamp]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'CREATE_SENSOR', `Додано дані сенсора ${sensorId} для продукту ${productId}: Температура ${temperature}°C, Вологість ${humidity}%`]
  );
  return result;
};

// Оновити дані сенсора
const updateSensorData = async (id, temperature, humidity, timestamp) => {
  const [result] = await db.query(
    'UPDATE SensorData SET Temperature = ?, Humidity = ?, Timestamp = ? WHERE DataID = ?',
    [temperature, humidity, timestamp, id]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'UPDATE_SENSOR', `Дані сенсора з ID ${id} оновлено: Температура ${temperature}°C, Вологість ${humidity}%`]
  );
  return result;
};

// Видалити дані за ID
const deleteSensorData = async (id) => {
  const [result] = await db.query('DELETE FROM SensorData WHERE DataID = ?', [id]);
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'DELETE_SENSOR', `Дані сенсора з ID ${id} видалено`]
  );
  return result;
};

// Отримати дані за сенсором
const getSensorDataBySensor = async (sensorId) => {
  const [rows] = await db.query('SELECT * FROM SensorData WHERE SensorID = ?', [sensorId]);
  return rows;
};

// Отримати дані за продуктом
const getSensorDataByProduct = async (productId) => {
  const [rows] = await db.query('SELECT * FROM SensorData WHERE ProductID = ?', [productId]);
  return rows;
};

// Отримати дані за датою та часом
const getSensorDataByDate = async (startDate, endDate) => {
  const [rows] = await db.query('SELECT * FROM SensorData WHERE Timestamp BETWEEN ? AND ?', [startDate, endDate]);
  return rows;
};

module.exports = {
  getSensorData,
  getSensorDataById,
  addSensorData,
  updateSensorData,
  deleteSensorData,
  getSensorDataBySensor,
  getSensorDataByProduct,
  getSensorDataByDate,
};