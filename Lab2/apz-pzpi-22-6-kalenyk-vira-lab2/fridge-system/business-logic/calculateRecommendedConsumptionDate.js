const db = require('../db');

const recommendConsumptionDate = async (req, res) => {
    try {
        const { productId } = req.params;

        // Отримати інформацію про продукт
        const [productRows] = await db.query(
            'SELECT p.ProductID, p.ExpirationDate, s.Temperature, s.Humidity ' +
            'FROM Products p ' +
            'LEFT JOIN SensorData s ON p.ProductID = s.ProductID ' +
            'WHERE p.ProductID = ?',
            [productId]
        );

        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = productRows[0];

        // Логіка розрахунку рекомендованої дати
        const adjustedDate = new Date(product.ExpirationDate);
        if (product.Temperature > 10) adjustedDate.setDate(adjustedDate.getDate() - 2);
        if (product.Humidity > 80) adjustedDate.setDate(adjustedDate.getDate() - 1);
        
        if (adjustedDate < new Date()) {
            return res.status(400).json({
                message: "Продукт вже не придатний до використання.",
                recommendedConsumptionDate: null,
            });
        }
        
        res.json({
            productId: product.ProductID,
            recommendedConsumptionDate: adjustedDate.toISOString().split('T')[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while calculating the recommended consumption date.' });
    }
};

module.exports = { recommendConsumptionDate };