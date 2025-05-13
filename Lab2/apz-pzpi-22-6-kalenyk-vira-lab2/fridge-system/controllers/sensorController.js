const sensorRepository = require('../repositories/sensorRepository');
const handleAnomalousData = require('../business-logic/handleAnomalousData');

// Отримати всі датчики
const getSensors = async (req, res) => {
  try {
    const sensors = await sensorRepository.getSensors();
    await handleAnomalousData(sensorData);
    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error fetching sensors:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
};

// Отримати датчик за ID
const getSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const sensor = await sensorRepository.getSensorById(id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.status(200).json(sensor);
  } catch (error) {
    console.error('Error fetching sensor:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
};

// Додати новий датчик
const addSensor = async (req, res) => {
  const { refrigeratorId, type, status } = req.body;
  try {
    const result = await sensorRepository.addSensor(refrigeratorId, type, status);
    res.status(201).json({ sensorId: result.insertId });
  } catch (error) {
    console.error('Error adding sensor:', error.message);
    res.status(500).json({ error: 'Failed to add sensor' });
  }
};

// Оновити датчик
const updateSensor = async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;
  try {
    const result = await sensorRepository.updateSensor(id, type, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.status(200).json({ message: 'Sensor updated successfully' });
  } catch (error) {
    console.error('Error updating sensor:', error.message);
    res.status(500).json({ error: 'Failed to update sensor' });
  }
};

// Видалити датчик
const deleteSensor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sensorRepository.deleteSensor(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    console.error('Error deleting sensor:', error.message);
    res.status(500).json({ error: 'Failed to delete sensor' });
  }
};

// Отримати датчики за холодильником
const getSensorsByRefrigerator = async (req, res) => {
  const { refrigeratorId } = req.params;
  try {
    const sensors = await sensorRepository.getSensorsByRefrigerator(refrigeratorId);
    if (sensors.length === 0) {
      return res.status(404).json({ error: 'No sensors found for this refrigerator' });
    }
    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error fetching sensors by refrigerator:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
};

// Оновити статус датчика
const updateSensorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await sensorRepository.updateSensorStatus(id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.status(200).json({ message: 'Sensor status updated successfully' });
  } catch (error) {
    console.error('Error updating sensor status:', error.message);
    res.status(500).json({ error: 'Failed to update sensor status' });
  }
};

// Отримати датчики за типом
const getSensorsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const sensors = await sensorRepository.getSensorsByType(type);
    if (sensors.length === 0) {
      return res.status(404).json({ error: `No sensors found of type '${type}'` });
    }
    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error fetching sensors by type:', error.message);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
};

module.exports = {
  getSensors,
  getSensorById,
  addSensor,
  updateSensor,
  deleteSensor,
  getSensorsByRefrigerator,
  updateSensorStatus,
  getSensorsByType,
};