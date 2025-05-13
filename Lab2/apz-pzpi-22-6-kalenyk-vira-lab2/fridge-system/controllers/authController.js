const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');

/**
 * Логін користувача
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Перевірка, чи існує користувач
        const [users] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Користувач не знайдений.' });
        }

        const user = users[0];

        // Перевірка пароля (припустимо, що паролі вже захешовані)
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильний пароль.' });
        }

        // Генерація токена
        const token = jwt.sign(
            { userId: user.UserID, role: user.Role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2d' } // Термін дії токена
        );

        const expiration = new Date();
        expiration.setHours(expiration.getDate() + 2); // Термін дії токена - 2 дні

        // Збереження токена в базу
        await db.query(
            'INSERT INTO UserTokens (UserID, Token, Expiration) VALUES (?, ?, ?)',
            [user.UserID, token, expiration]
        );

        res.json({
            message: 'Авторизація успішна.',
            token,
            expiration,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при авторизації.' });
    }
};

/**
 * Реєстрація нового користувача
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log('Дані для реєстрації:', { name, email, password, role });

        // Перевірка, чи існує користувач із таким email
        const [existingUsers] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Користувач із таким email вже існує.' });
        }

        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Додавання нового користувача до бази даних
        const [result] = await db.query(
            'INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'RegularUser'] // Роль за замовчуванням
        );

        const userId = result.insertId;

        // Генерація токена
        const token = jwt.sign(
            { userId, role: role || 'RegularUser' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2d' } // Термін дії токена
        );

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1); // Термін дії токена - 1 година

        // Збереження токена в базу
        await db.query(
            'INSERT INTO UserTokens (UserID, Token, Expiration) VALUES (?, ?, ?)',
            [userId, token, expiration]
        );

        res.status(201).json({
            message: 'Користувач успішно зареєстрований.',
            userId,
            token,
        });
    } catch (error) {
        console.error('Помилка при реєстрації користувача:', error.message);
        res.status(500).json({ message: 'Помилка при реєстрації користувача.' });
    }
};

module.exports = { loginUser, registerUser };