const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const { userRole } = req;

            console.log('--- Перевірка прав доступу ---');
            console.log('Роль користувача:', userRole);
            console.log('Дозволені ролі для цього маршруту:', allowedRoles);
            console.log('Маршрут, до якого намагається отримати доступ:', req.originalUrl);
            
            if (!allowedRoles.includes(userRole)) {
                console.log('Доступ заборонено. Роль не співпадає.');
                return res.status(403).json({ message: "Недостатньо прав доступу." });
            }

            console.log('Доступ дозволено.');
            next();
        } catch (error) {
            console.error('Помилка авторизації:', error.message);
            res.status(500).json({ message: 'Authorization Error', error });
        }
    };
};

module.exports = checkRole;
