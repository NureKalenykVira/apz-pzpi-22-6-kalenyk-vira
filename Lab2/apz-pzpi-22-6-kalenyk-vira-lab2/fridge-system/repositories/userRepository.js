const db = require('../db');

async function getUsers() {
  const [rows] = await db.query(
      `SELECT u.UserID, u.Name, u.Email, u.Role, u.Password, u.CreatedAt, u.UpdatedAt, ut.Token 
       FROM Users u
       LEFT JOIN UserTokens ut ON u.UserID = ut.UserID`
  );
  return rows;
}

async function getUserById(id) {
    const [users] = await db.execute(`SELECT * FROM Users WHERE UserID = ?`, [id]);
    console.log('Query result:', users);
    return users[0];
  }

async function updateUser(id, name, email, password, role) {
    const [result] = await db.execute(
      `UPDATE Users SET Name = ?, Email = ?, Password = ?, Role = ? WHERE UserID = ?`,
      [name, email, password, role, id]
    );
    await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [adminId, 'UPDATE_ROLE', `Дані користувача ${name} з email ${email} оновлено. Нова роль: ${role}`]
  );
    return result;
  }

async function addUser(name, email, password, role) {
    const [existingUser] = await db.execute(
      `SELECT * FROM Users WHERE Email = ?`,
      [email]
    );
  
    if (existingUser.length > 0) {
      throw new Error('Email already exists');
    }
  
    const [result] = await db.execute(
      `INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)`,
      [name, email, password, role]
    );
  
    await db.query(
      'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
      [adminId, 'CREATE_USER', `Користувача ${name} з email ${email} та роллю ${role} створено`]
    );

    return result;
  }

async function deleteUser(id) {
    const [result] = await db.execute(`DELETE FROM Users WHERE UserID = ?`, [id]);
    await db.query(
    'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
    [adminId, 'DELETE_USER', `Користувача з ID ${id} видалено`]
  );
    return result;
  }

  async function updateUserProfile(userId, name, email, password) {
    // Масиви для динамічних частин запиту
    const queryParts = [];
    const queryParams = [];
  
    // Додавання полів до запиту
    if (name) {
        queryParts.push('Name = ?');
        queryParams.push(name);
    }
    if (email) {
        queryParts.push('Email = ?');
        queryParams.push(email);
    }
    if (password) {
        queryParts.push('Password = ?');
        queryParams.push(password);
    }
  
    // Перевірка: якщо немає полів для оновлення
    if (queryParts.length === 0) {
        throw new Error('Не надано жодного поля для оновлення.');
    }
  
    // Формування запиту
    const query = `
        UPDATE Users
        SET ${queryParts.join(', ')}
        WHERE UserID = ?;
    `;
    queryParams.push(userId); // Додаємо UserID до параметрів
  
    // Виконання запиту
    try {
        const [result] = await db.execute(query, queryParams);
        return result;
    } catch (error) {
        console.error('Помилка виконання SQL-запиту:', error);
        throw new Error('Не вдалося оновити профіль користувача.');
    }
}

module.exports = {
    addUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserProfile
  };