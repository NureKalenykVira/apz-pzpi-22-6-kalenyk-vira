const db = require('../db');

// Генерація загальних звітів
const generateGeneralReport = async (req, res) => {
    try {
        const [userCounts] = await db.query('SELECT COUNT(*) AS userCount FROM Users');
        const [productCounts] = await db.query('SELECT COUNT(*) AS productCount FROM Products');
        const [notificationCounts] = await db.query('SELECT COUNT(*) AS notificationCount FROM Notifications');
        const [expiredProducts] = await db.query(
            'SELECT COUNT(*) AS expiredCount FROM Products WHERE ExpirationDate < NOW()'
        );

        res.status(200).json({
            totalUsers: userCounts[0].userCount,
            totalProducts: productCounts[0].productCount,
            totalNotifications: notificationCounts[0].notificationCount,
            expiredProducts: expiredProducts[0].expiredCount,
        });
    } catch (error) {
        console.error('Помилка генерації звіту:', error);
        res.status(500).json({ message: 'Помилка генерації звіту.' });
    }
};

module.exports = { generateGeneralReport };