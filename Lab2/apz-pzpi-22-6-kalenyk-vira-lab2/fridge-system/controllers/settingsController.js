const { getThresholds, updateThresholds, getInterval, updateInterval } = require('../config/thresholdsManager');

// Отримання порогових значень
const getThresholdsHandler = (req, res) => {
    res.json(getThresholds());
};

// Оновлення порогових значень
const updateThresholdsHandler = (req, res) => {
    const { maxTemperature, minTemperature, maxHumidity, minHumidity } = req.body;

    if (
        maxTemperature === undefined ||
        minTemperature === undefined ||
        maxHumidity === undefined ||
        minHumidity === undefined
    ) {
        return res.status(400).json({ message: 'Invalid thresholds data.' });
    }

    updateThresholds({ maxTemperature, minTemperature, maxHumidity, minHumidity });
    res.status(200).json({ message: 'Thresholds updated successfully.' });
};

// Отримання частоти передачі даних
const getIntervalHandler = (req, res) => {
    res.json({ frequency: getInterval() });
};

// Оновлення інтервалу передачі даних
const updateIntervalHandler = (req, res) => {
    const { frequency } = req.body;

    if (typeof frequency !== 'number' || frequency <= 0) {
        return res.status(400).json({ message: 'Invalid interval frequency.' });
    }

    updateInterval(frequency);
    res.status(200).json({ message: 'Interval updated successfully.' });
};

module.exports = {
    getThresholdsHandler,
    updateThresholdsHandler,
    getIntervalHandler,
    updateIntervalHandler,
};
