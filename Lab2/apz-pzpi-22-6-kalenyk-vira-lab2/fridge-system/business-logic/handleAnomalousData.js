const db = require('../db');

// Обробка аномальних даних
const handleAnomalousData = async (req, res) => {
    try {
        const [sensorRows] = await db.query(
            'SELECT s.SensorID, r.UserID, sd.Temperature, sd.Humidity, sd.Timestamp ' +
            'FROM Sensors s ' +
            'JOIN Refrigerators r ON s.RefrigeratorID = r.RefrigeratorID ' +
            'JOIN SensorData sd ON s.SensorID = sd.SensorID ' +
            'WHERE sd.Timestamp = (SELECT MAX(Timestamp) FROM SensorData WHERE SensorID = s.SensorID)'
        );

        if (sensorRows.length === 0) {
            return res.status(404).json({ message: 'Дані сенсорів не знайдені.' });
        }

        const anomalies = [];

        // Умови зберігання
        const expectedConditions = { maxTemperature: 10, maxHumidity: 80 };

        for (const sensor of sensorRows) {
            const { SensorID, UserID, Temperature, Humidity, Timestamp } = sensor;

            const issues = [];
            if (Temperature > expectedConditions.maxTemperature) {
                issues.push(`Температура перевищує норму: ${Temperature}°C.`);
            }

            if (Humidity > expectedConditions.maxHumidity) {
                issues.push(`Вологість перевищує норму: ${Humidity}%.`);
            }

            if (issues.length > 0) {
                anomalies.push({ SensorID, issues });

                // Додати сповіщення в базу даних
                await db.query(
                    'INSERT INTO Notifications (UserID, Message, Status) VALUES (?, ?, ?)',
                    [UserID, `Сенсор ${SensorID} виявив проблеми:\n- ${issues.join('\n- ')}`, 'New']
                );
            }
        }

        res.json({
            message: 'Оброблено дані сенсорів. Сповіщення додано до бази даних.',
            anomalies,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Виникла помилка під час обробки аномальних даних.' });
    }
};

module.exports = { handleAnomalousData };