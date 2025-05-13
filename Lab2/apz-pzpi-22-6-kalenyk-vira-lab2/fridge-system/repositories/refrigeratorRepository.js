const db = require('../db');

const getRefrigerators = async () => {
  const [rows] = await db.query('SELECT * FROM Refrigerators');
  return rows;
};

const getRefrigeratorById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Refrigerators WHERE RefrigeratorID = ?', [id]);
  return rows[0];
};

const addRefrigerator = async (userId, name, location) => {
  const [result] = await db.query(
    'INSERT INTO Refrigerators (UserID, Name, Location) VALUES (?, ?, ?)',
    [userId, name, location]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'CREATE_FRIDGE', `Fridge ${name} додано в локацію ${location}`]
  );
  return result;
};

const updateRefrigerator = async (id, userId, name, location) => {
  const [result] = await db.query(
    'UPDATE Refrigerators SET UserID = ?, Name = ?, Location = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE RefrigeratorID = ?',
    [userId, name, location, id]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'UPDATE_FRIDGE', `Fridge ${name} оновлено в локації ${location}`]
  );
  return result;
};

const deleteRefrigerator = async (id) => {
  const [result] = await db.query('DELETE FROM Refrigerators WHERE RefrigeratorID = ?', [id]);
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'DELETE_FRIDGE', `Fridge з ID ${id} видалено`]
  );
  return result;
};

const getRefrigeratorsByUser = async (userId) => {
    const [rows] = await db.query('SELECT * FROM Refrigerators WHERE UserID = ?', [userId]);
    return rows;
}; 

const getRefrigeratorsByLocation = async (location) => {
    const [rows] = await db.query('SELECT * FROM Refrigerators WHERE Location = ?', [location]);
    return rows;
};

const getRefrigeratorLastUpdate = async (id) => {
    const [rows] = await db.query(
        'SELECT UpdatedAt FROM Refrigerators WHERE RefrigeratorID = ?',
        [id]
    );
    return rows[0];
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