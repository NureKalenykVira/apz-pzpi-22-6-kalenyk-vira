const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * Middleware для перевірки токена
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Необхідна авторизація.' });
    }

    try {
        // Перевірка токена через JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Перевірка токена в базі даних
        const [rows] = await db.query(
            'SELECT * FROM UserTokens WHERE Token = ? AND Expiration > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Токен недійсний або термін дії завершено.' });
        }

        req.userId = decoded.userId; // Додаємо userId до req
        req.userRole = decoded.role; // Додаємо роль до req
        console.log('Роль, отримана з токена:', decoded.role);
        next();
    } catch (error) {

        console.error('Помилка авторизації:', error);
        res.status(403).json({ message: 'Неправильний або прострочений токен.' });
    }
};

module.exports = authenticateToken;