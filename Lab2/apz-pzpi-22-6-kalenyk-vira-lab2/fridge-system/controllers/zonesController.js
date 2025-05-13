const db = require('../db'); // Підключення до бази даних

const getZones = async (req, res) => {
    try {
        // Запит до бази даних для отримання зон
        const [zones] = await db.query(`
            SELECT 
                z.ZoneID, 
                z.ZoneName, 
                r.RefrigeratorID, 
                r.Name AS RefrigeratorName
            FROM Zones z
            INNER JOIN Refrigerators r ON z.RefrigeratorID = r.RefrigeratorID
        `);

        // Групування зон за холодильниками
        const refrigerators = zones.reduce((acc, zone) => {
            const { RefrigeratorID, RefrigeratorName, ZoneID, ZoneName } = zone;

            if (!acc[RefrigeratorID]) {
                acc[RefrigeratorID] = {
                    id: RefrigeratorID,
                    name: RefrigeratorName,
                    zones: [],
                };
            }

            acc[RefrigeratorID].zones.push({
                id: ZoneID,
                name: ZoneName,
            });

            return acc;
        }, {});

        const response = Object.values(refrigerators);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching zones:', error.message);
        res.status(500).json({ message: 'Error fetching zones.' });
    }
};

module.exports = { getZones };