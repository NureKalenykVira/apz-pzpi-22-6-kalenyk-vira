const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Помилка отримання користувачів:', error);
    res.status(500).json({ message: 'Помилка отримання користувачів' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
};

const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await userRepository.addUser(name, email, password, role);
  res.status(201).json({ userId: result.insertId });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const result = await userRepository.updateUser(id, name, email, password, role);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
  res.status(200).json({ message: 'User updated successfully' });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await userRepository.deleteUser(id);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
  res.status(200).json({ message: 'User deleted successfully' });
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // ID користувача отримується з токена
    console.log('ID користувача (updateUserProfile):', userId);
    console.log('Роль користувача (updateUserProfile):', req.userRole);
    const { name, email, password } = req.body;

    // Перевірка, чи потрібно оновлювати пароль
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Оновлення даних користувача
    const result = await userRepository.updateUserProfile(
      userId,
      name,
      email,
      hashedPassword
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Користувач не знайдений.' });
    }

    res.status(200).json({ message: 'Профіль успішно оновлено.' });
  } catch (error) {
    console.error('Помилка при оновленні профілю користувача:', error);
    res.status(500).json({ message: 'Помилка при оновленні профілю користувача.' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserProfile
};