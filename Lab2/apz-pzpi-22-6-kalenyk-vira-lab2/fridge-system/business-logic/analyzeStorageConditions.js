const db = require('../db');

// Функція для аналізу умов зберігання
const analyzeStorageConditions = (sensorData, recommendedConditions) => {
    const issues = [];
    console.log('Перевірка умов зберігання:', sensorData, recommendedConditions);

    if (sensorData.temperature > recommendedConditions.maxTemperature) {
        console.log('Температура перевищує норму.');
        issues.push('Температура перевищує норму.');
    }
    if (sensorData.temperature < recommendedConditions.minTemperature) {
        console.log('Температура нижче норми.');
        issues.push('Температура нижче норми.');
    }
    if (sensorData.humidity > recommendedConditions.maxHumidity) {
        console.log('Вологість перевищує норму.');
        issues.push('Вологість перевищує норму.');
    }
    if (sensorData.humidity < recommendedConditions.minHumidity) {
        console.log('Вологість нижче норми.');
        issues.push('Вологість нижче норми.');
    }

    console.log('Проблеми:', issues);
    return issues;
};

// Маршрутний обробник
const analyzeStorageHandler = async (req, res) => {
    try {
        const { sensorId } = req.params;

        // Отримання даних із бази даних
        const [sensorRows] = await db.query(
            'SELECT Temperature, Humidity, Timestamp FROM SensorData WHERE SensorID = ? ORDER BY Timestamp DESC LIMIT 1',
            [sensorId]
        );

        if (sensorRows.length === 0) {
            return res.status(404).json({ message: 'Дані сенсора не знайдені.' });
        }

        // Перетворення ключів на малі літери
        const sensorData = {
            temperature: sensorRows[0].Temperature,
            humidity: sensorRows[0].Humidity,
            timestamp: sensorRows[0].Timestamp
        };

        const recommendedConditions = {
            maxTemperature: 10,
            minTemperature: 2,
            maxHumidity: 80,
            minHumidity: 30
        };

        const issues = analyzeStorageConditions(sensorData, recommendedConditions);

        let message;
        if (issues.length > 0) {
            message = `Проблеми з умовами зберігання: ${issues.join(' ')}`;

            // Додавання повідомлення до таблиці Notifications
            await db.query(
                'INSERT INTO Notifications (UserID, DataID, Message, Status) VALUES (?, ?, ?, ?)',
                [1, sensorId, message, 'New'] // UserID можна замінити на відповідного користувача
            );
        } else {
            message = 'Умови зберігання в нормі.';
        }
        
        res.json({ sensorId, ...sensorData, issues, message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while analyzing storage conditions." });
    }
};

module.exports = { analyzeStorageHandler };