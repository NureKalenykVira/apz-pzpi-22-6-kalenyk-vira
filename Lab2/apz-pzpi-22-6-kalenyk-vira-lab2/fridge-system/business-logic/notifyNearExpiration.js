const db = require('../db');
const sendNotification = require('../business-logic/sendNotification');

const notifyNearExpiration = async (req, res) => {
    try {
        const [rows] = await db.query(
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
                DATEDIFF(p.ExpirationDate, CURDATE()) <= 2 
                AND DATEDIFF(p.ExpirationDate, CURDATE()) > 0`
        );

        if (rows.length === 0) {
            return res.status(200).json({ message: "No products nearing expiration." });
        }

        for (const product of rows) {
            const notificationMessage = `Hello ${product.UserName}, your product "${product.ProductName}" is about to expire on ${product.ExpirationDate}. Please use it soon.`;

            await db.query(
                `INSERT INTO Notifications (UserID, Message, Status) VALUES (?, ?, ?)`,
                [product.UserID, notificationMessage, 'New']
            );

            console.log(
                `Notification added for ${product.UserName} (${product.Email}) about product "${product.ProductName}".`
            );
        }

        res.status(200).json({
            message: "Notifications created successfully.",
            notifications: rows.map((product) => ({
                userId: product.UserID,
                productName: product.ProductName,
                expirationDate: product.ExpirationDate,
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while notifying near-expiration products." });
    }
};

module.exports = { notifyNearExpiration };