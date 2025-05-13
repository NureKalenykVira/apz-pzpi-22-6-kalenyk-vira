const db = require('../db');

// Отримати всі конфігурації
const getConfigurations = async (req, res) => {
    try {
        const [configs] = await db.query('SELECT * FROM SystemConfigurations');
        res.status(200).json(configs);
    } catch (error) {
        console.error('Помилка отримання конфігурацій:', error);
        res.status(500).json({ message: 'Помилка отримання конфігурацій.' });
    }
};

// Оновити конфігурацію
const updateConfiguration = async (req, res) => {
    try {
        const { configName, configValue } = req.body;
        await db.query(
            'UPDATE SystemConfigurations SET ConfigValue = ? WHERE ConfigName = ?',
            [configValue, configName]
        );
        res.status(200).json({ message: 'Конфігурацію успішно оновлено.' });
    } catch (error) {
        console.error('Помилка оновлення конфігурації:', error);
        res.status(500).json({ message: 'Помилка оновлення конфігурації.' });
    }
};

module.exports = { getConfigurations, updateConfiguration };