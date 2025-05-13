const db = require('../db');

const getProducts = async () => {
  const [rows] = await db.query('SELECT * FROM Products');
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Products WHERE ProductID = ?', [id]);
  return rows[0];
};

const addProduct = async (refrigeratorId, name, category, expirationDate, rfidTag) => {
  const [result] = await db.query(
    'INSERT INTO Products (RefrigeratorID, Name, Category, ExpirationDate, RFIDTag) VALUES (?, ?, ?, ?, ?)',
    [refrigeratorId, name, category, expirationDate, rfidTag]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'CREATE_PRODUCT', `Продукт ${name} (категорія: ${category}) додано в холодильник з ID ${refrigeratorId}`]
  );
  return result;
};

const updateProduct = async (id, name, category, expirationDate, rfidTag) => {
  const [result] = await db.query(
    'UPDATE Products SET Name = ?, Category = ?, ExpirationDate = ?, RFIDTag = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE ProductID = ?',
    [name, category, expirationDate, rfidTag, id]
  );
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'UPDATE_PRODUCT', `Продукт ${name} (ID: ${id}) оновлено. Нова категорія: ${category}, дата закінчення: ${expirationDate}`]
  );
  return result;
};

const deleteProduct = async (id) => {
  const [result] = await db.query('DELETE FROM Products WHERE ProductID = ?', [id]);
  await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [userId, 'DELETE_PRODUCT', `Продукт з ID ${id} видалено`]
  );
  return result;
};

const getProductsByRefrigerator = async (refrigeratorId) => {
  const [rows] = await db.query('SELECT * FROM Products WHERE RefrigeratorID = ?', [refrigeratorId]);
  return rows;
};

const getProductsByCategory = async (category) => {
  const [rows] = await db.query('SELECT * FROM Products WHERE Category = ?', [category]);
  return rows;
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByRefrigerator,
  getProductsByCategory,
};