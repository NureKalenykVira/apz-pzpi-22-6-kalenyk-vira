const refrigeratorRepository = require('../repositories/refrigeratorRepository');

// Отримання всіх холодильників
const getRefrigerators = async (req, res) => {
  try {
    const refrigerators = await refrigeratorRepository.getRefrigerators();
    res.status(200).json(refrigerators);
  } catch (error) {
    console.error('Error fetching refrigerators:', error.message);
    res.status(500).json({ error: 'Failed to fetch refrigerators' });
  }
};

// Отримання холодильника за ID
const getRefrigeratorById = async (req, res) => {
  const { id } = req.params;
  try {
    const refrigerator = await refrigeratorRepository.getRefrigeratorById(id);
    if (!refrigerator) {
      return res.status(404).json({ error: 'Refrigerator not found' });
    }
    res.status(200).json(refrigerator);
  } catch (error) {
    console.error('Error fetching refrigerator:', error.message);
    res.status(500).json({ error: 'Failed to fetch refrigerator' });
  }
};

// Додавання нового холодильника
const addRefrigerator = async (req, res) => {
  const { userId, name, location } = req.body;
  try {
    const result = await refrigeratorRepository.addRefrigerator(userId, name, location);
    await logAdminAction(req.userId, 'CREATE_FRIDGE', `Fridge ${name} додано`);
    res.status(201).json({ refrigeratorId: result.insertId });
  } catch (error) {
    console.error('Error adding refrigerator:', error.message);
    res.status(500).json({ error: 'Failed to add refrigerator' });
  }
};

// Оновлення холодильника
const updateRefrigerator = async (req, res) => {
  const { id } = req.params;
  const { userId, name, location } = req.body;
  try {
    const result = await refrigeratorRepository.updateRefrigerator(id, userId, name, location);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Refrigerator not found' });
    }
    await logAdminAction(req.userId, 'UPDATE_FRIDGE', `Fridge ID ${id} оновлено`);
    res.status(200).json({ message: 'Refrigerator updated successfully' });
  } catch (error) {
    console.error('Error updating refrigerator:', error.message);
    res.status(500).json({ error: 'Failed to update refrigerator' });
  }
};

// Видалення холодильника
const deleteRefrigerator = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await refrigeratorRepository.deleteRefrigerator(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Refrigerator not found' });
    }
    await logAdminAction(req.userId, 'DELETE_FRIDGE', `Fridge ID ${id} видалено`);
    res.status(200).json({ message: 'Refrigerator deleted successfully' });
  } catch (error) {
    console.error('Error deleting refrigerator:', error.message);
    res.status(500).json({ error: 'Failed to delete refrigerator' });
  }  
};

const getRefrigeratorsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
      const refrigerators = await refrigeratorRepository.getRefrigeratorsByUser(userId);
      if (refrigerators.length === 0) {
        return res.status(404).json({ error: 'No refrigerators found for this user' });
      }
      res.status(200).json(refrigerators);
    } catch (error) {
      console.error('Error fetching refrigerators by user:', error.message);
      res.status(500).json({ error: 'Failed to fetch refrigerators' });
    }
};

const getRefrigeratorsByLocation = async (req, res) => {
    const { location } = req.params;
    try {
      const refrigerators = await refrigeratorRepository.getRefrigeratorsByLocation(location);
      if (refrigerators.length === 0) {
        return res.status(404).json({ error: 'No refrigerators found at this location' });
      }
      res.status(200).json(refrigerators);
    } catch (error) {
      console.error('Error fetching refrigerators by location:', error.message);
      res.status(500).json({ error: 'Failed to fetch refrigerators' });
    }
};

const getRefrigeratorLastUpdate = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await refrigeratorRepository.getRefrigeratorLastUpdate(id);
        if (!result) {
            return res.status(404).json({ error: 'Refrigerator not found' });
        }
        res.status(200).json({ lastUpdated: result.UpdatedAt });
    } catch (error) {
        console.error('Error fetching last update time:', error.message);
        res.status(500).json({ error: 'Failed to fetch last update time' });
    }
};

const logAdminAction = async (adminId, action, description) => {
    try {
        await db.query(
            'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
            [adminId, action, description]
        );
    } catch (error) {
        console.error('Помилка додавання логів:', error.message);
    }
};

module.exports = {
  getRefrigerators,
  getRefrigeratorById,
  addRefrigerator,
  updateRefrigerator,
  deleteRefrigerator,
  getRefrigeratorsByUser,
  getRefrigeratorsByLocation,
  getRefrigeratorLastUpdate,
};
