let thresholds = {
    maxTemperature: 8,
    minTemperature: 0,
    maxHumidity: 70,
    minHumidity: 30,
};

let interval = 60000;

function getThresholds() {
    return thresholds;
}

function updateThresholds(newThresholds) {
    thresholds = { ...thresholds, ...newThresholds };
}

function getInterval() {
    return interval;
}

const updateInterval = (newInterval) => {
    intervalFrequency = newInterval;
};

function getZones() {
    return zones;
}

module.exports = {
    getThresholds,
    updateThresholds,
    getInterval,
    updateInterval,
    getZones,
};
