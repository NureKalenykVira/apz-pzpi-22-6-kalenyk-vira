const db = require('../db');

// Функція для генерації звітів про продукти користувача
const generateUserReports = async (req, res) => {
    try {
        const { userId } = req.params;

        const [products] = await db.query(
            `SELECT 
    p.Name, 
    p.ExpirationDate, 
    CONCAT('Холодильник: ', r.Name, ', Локація: ', r.Location) AS StorageConditions,
    s.Temperature, 
    s.Humidity, 
    s.Timestamp AS LastSensorUpdate
FROM Products p
JOIN Refrigerators r ON p.RefrigeratorID = r.RefrigeratorID
LEFT JOIN (
    SELECT 
        ProductID, 
        MAX(Timestamp) AS LastTimestamp
    FROM SensorData
    GROUP BY ProductID
) latest_data ON p.ProductID = latest_data.ProductID
LEFT JOIN SensorData s ON s.ProductID = latest_data.ProductID AND s.Timestamp = latest_data.LastTimestamp
WHERE r.UserID = 1;`, [userId]);

        // Якщо продукти не знайдено
        if (products.length === 0) {
            return res.status(404).json({ message: "Продукти користувача не знайдені." });
        }

        const now = new Date();

        console.log('UserID:', userId);
        console.log('SQL Query Execution');

        // Формування звіту
        const report = products.map((product) => {
            const expirationDate = new Date(product.ExpirationDate);
            const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

            // Розрахунок рекомендованої дати споживання
            const recommendedConsumptionDate = new Date(product.ExpirationDate);
            if (product.Temperature > 10) recommendedConsumptionDate.setDate(recommendedConsumptionDate.getDate() - 2);
            if (product.Humidity > 80) recommendedConsumptionDate.setDate(recommendedConsumptionDate.getDate() - 1);

            return {
                name: product.Name,
                expirationDate: product.ExpirationDate,
                storageConditions: product.StorageConditions,
                lastSensorData: {
                    temperature: product.Temperature,
                    humidity: product.Humidity,
                    lastUpdate: product.LastSensorUpdate,
                },
                daysLeft: daysLeft > 0 ? daysLeft : 0,
                recommendedConsumptionDate: recommendedConsumptionDate.toISOString().split('T')[0],
                status: daysLeft <= 0 ? "Протерміновано" : "Придатний",
            };
        });

        const expiredCount = report.filter((product) => product.status === "Протерміновано").length;

        res.json({
            userId,
            expiredCount,
            report,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while generating the user report." });
    }
};

module.exports = { generateUserReports};