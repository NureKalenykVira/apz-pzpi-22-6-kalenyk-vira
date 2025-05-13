const sendNotification = require('../business-logic/sendNotification');
const db = require('../db');

const notifyExpiration = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT 
                p.ProductID, p.Name AS ProductName, p.ExpirationDate, 
                r.UserID, u.Name AS UserName, u.Email 
             FROM 
                Products p
             JOIN 
                Refrigerators r ON p.RefrigeratorID = r.RefrigeratorID
             JOIN 
                Users u ON r.UserID = u.UserID
             WHERE 
                p.ExpirationDate < CURDATE()`
        );

        if (products.length === 0) {
            return res.status(200).json({ message: "No expired products found." });
        }

        const notifications = [];

        for (const product of products) {
            const notificationMessage = `Dear ${product.UserName}, your product "${product.ProductName}" expired on ${product.ExpirationDate}. Please discard it.`;

            // Додаємо сповіщення до таблиці Notifications
            await db.query(
                `INSERT INTO Notifications (UserID, Message, Status) VALUES (?, ?, ?)`,
                [product.UserID, notificationMessage, 'New']
            );

            notifications.push({
                userId: product.UserID,
                userName: product.UserName,
                productName: product.ProductName,
                expirationDate: product.ExpirationDate,
                message: notificationMessage,
            });
        }

        res.status(200).json({
            message: "Expiration notifications created successfully.",
            notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while sending expiration notifications." });
    }
};

module.exports = { notifyExpiration };