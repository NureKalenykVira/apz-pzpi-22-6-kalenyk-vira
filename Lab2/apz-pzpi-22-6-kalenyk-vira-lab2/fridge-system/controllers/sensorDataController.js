const sensorDataRepository = require('../repositories/sensorDataRepository');

// Отримати всі записи
const getSensorData = async (req, res) => {
  try {
    const data = await sensorDataRepository.getSensorData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching sensor data:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
};

// Отримати дані за ID
const getSensorDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await sensorDataRepository.getSensorDataById(id);
    if (!data) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching sensor data:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
};

// Додати нові дані сенсора
const addSensorData = async (req, res) => {
  const { sensorId, productId, temperature, humidity, timestamp } = req.body;
  try {
    const result = await sensorDataRepository.addSensorData(sensorId, productId, temperature, humidity, timestamp);
    res.status(201).json({ dataId: result.insertId });
  } catch (error) {
    console.error('Error adding sensor data:', error.message);
    res.status(500).json({ error: 'Failed to add sensor data' });
  }
};

// Оновити дані
const updateSensorData = async (req, res) => {
  const { id } = req.params;
  const { temperature, humidity, timestamp } = req.body;
  try {
    const result = await sensorDataRepository.updateSensorData(id, temperature, humidity, timestamp);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }
    res.status(200).json({ message: 'Sensor data updated successfully' });
  } catch (error) {
    console.error('Error updating sensor data:', error.message);
    res.status(500).json({ error: 'Failed to update sensor data' });
  }
};

// Видалити дані
const deleteSensorData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sensorDataRepository.deleteSensorData(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sensor data not found' });
    }
    res.status(200).json({ message: 'Sensor data deleted successfully' });
  } catch (error) {
    console.error('Error deleting sensor data:', error.message);
    res.status(500).json({ error: 'Failed to delete sensor data' });
  }
};

// Додаткові функції
const getSensorDataBySensor = async (req, res) => {
  const { sensorId } = req.params;
  try {
    const data = await sensorDataRepository.getSensorDataBySensor(sensorId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data by sensor' });
  }
};

const getSensorDataByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await sensorDataRepository.getSensorDataByProduct(productId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data by product' });
  }
};

const getSensorDataByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const data = await sensorDataRepository.getSensorDataByDate(startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data by date range' });
  }
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