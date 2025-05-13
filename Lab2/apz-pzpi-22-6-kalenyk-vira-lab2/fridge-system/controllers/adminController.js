const db = require('../db');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// GlobalAdmin функції
const getAlgorithmSettings = async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM AlgorithmSettings');
        res.status(200).json(settings);
    } catch (error) {
        console.error('Помилка отримання налаштувань алгоритмів:', error);
        res.status(500).json({ message: 'Помилка отримання налаштувань алгоритмів.' });
    }
};

const updateAlgorithmSettings = async (req, res) => {
    try {
        const { settingId, value } = req.body; // Поле називається value, не SettingValue
        const [result] = await db.query(
            'UPDATE AlgorithmSettings SET Value = ? WHERE SettingID = ?',
            [value, settingId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Налаштування не знайдено.' });
        }
        res.status(200).json({ message: 'Налаштування успішно оновлено.' });
    } catch (error) {
        console.error('Помилка оновлення налаштувань алгоритмів:', error);
        res.status(500).json({ message: 'Помилка оновлення налаштувань алгоритмів.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM Users');
        res.status(200).json(users);
    } catch (error) {
        console.error('Помилка отримання користувачів:', error);
        res.status(500).json({ message: 'Помилка отримання користувачів.' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Users WHERE id = ?', [id]);
        res.status(200).json({ message: 'Користувач видалений успішно' });
    } catch (error) {
        console.error('Помилка видалення користувача:', error);
        res.status(500).json({ message: 'Помилка видалення користувача.' });
    }
};

const monitorAPIStatus = async (req, res) => {
    try {
        const services = [
            { name: "Auth Service", url: "http://localhost:5000/api/health" },
            { name: "Product Service", url: "http://localhost:5001/api/health" },
            { name: "Refrigerator Service", url: "http://localhost:5002/api/health" },
        ];

        const statusPromises = services.map((service) =>
            fetch(service.url)
                .then((response) => ({ name: service.name, status: response.ok ? "Online" : "Offline" }))
                .catch(() => ({ name: service.name, status: "Offline" }))
        );

        const statuses = await Promise.all(statusPromises);
        res.status(200).json(statuses);
    } catch (error) {
        console.error("Помилка під час моніторингу API:", error.message);
        res.status(500).json({ message: "Помилка під час моніторингу API" });
    }
};

const getConfigurations = async (req, res) => {
    try {
        const [configurations] = await db.query('SELECT * FROM Configurations');
        res.status(200).json(configurations);
    } catch (error) {
        console.error('Помилка отримання конфігурацій:', error);
        res.status(500).json({ message: 'Помилка отримання конфігурацій.' });
    }
};

const updateConfiguration = async (req, res) => {
    const { configId, configValue } = req.body;

    if (!configId || !configValue) {
        return res.status(400).json({ message: 'Потрібні значення configId і configValue.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Configurations SET config_value = ? WHERE id = ?',
            [configValue, configId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Конфігурацію не знайдено.' });
        }
        res.status(200).json({ message: 'Конфігурацію успішно оновлено.' });
    } catch (error) {
        console.error('Помилка оновлення конфігурації:', error);
        res.status(500).json({ message: 'Помилка оновлення конфігурації.' });
    }
};

const generateGeneralReport = async (req, res) => {
    try {
        const [fridges] = await db.query('SELECT COUNT(*) AS count FROM Refrigerators');
        const [products] = await db.query('SELECT COUNT(*) AS count FROM Products');
        const [sensors] = await db.query('SELECT COUNT(*) AS count FROM Sensors');

        const report = {
            totalFridges: fridges[0].count,
            totalProducts: products[0].count,
            totalSensors: sensors[0].count,
            generatedAt: new Date().toISOString()
        };

        res.status(200).json(report);
    } catch (error) {
        console.error('Помилка генерації звіту:', error);
        res.status(500).json({ message: 'Помилка генерації звіту.' });
    }
};

const changeUserRole = async (req, res) => {
    const { UserId, newRole } = req.body;

    console.log("ID користувача з токена: ", req.userId);

    if (!UserId || !newRole) {
        return res.status(400).json({ message: 'Необхідні UserId та newRole.' });
    }

    const allowedRoles = ['User', 'GlobalAdmin', 'BusinessLogicAdmin', 'ServiceAdmin', 'InfrastructureAdmin'];
    if (!allowedRoles.includes(newRole)) {
        return res.status(400).json({ message: 'Некоректна роль. Доступні ролі: ' + allowedRoles.join(', ') });
    }

    try {
        const [result] = await db.query(
            'UPDATE Users SET Role = ? WHERE UserId = ?',
            [newRole, UserId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Користувача не знайдено або роль вже така сама.' });
        }

        console.log("Додаємо запис у AdminLogs");

        await db.query(
            'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
            [req.userId, 'UPDATE_ROLE', `Role updated to ${newRole} for user ID ${UserId}`]
        );

        console.log("Запис додано в AdminLogs");

        res.status(200).json({ message: `Роль успішно оновлена на ${newRole}.` });
    } catch (error) {
        console.error('Помилка оновлення ролі:', error);
        res.status(500).json({ message: 'Помилка оновлення ролі.' });
    }
};

const getAdminLogs = async (req, res) => {
    try {
        const [logs] = await db.query('SELECT * FROM AdminLogs ORDER BY created_at DESC');
        res.status(200).json(logs);
    } catch (error) {
        console.error('Помилка отримання логів:', error);
        res.status(500).json({ message: 'Помилка отримання логів.' });
    }
};

// BusinessLogicAdmin функції
const getSensorThresholds = async (req, res) => {
    try {
        const [thresholds] = await db.query('SELECT * FROM SensorThresholds');
        res.status(200).json(thresholds);
    } catch (error) {
        console.error('Помилка отримання порогів сенсорів:', error);
        res.status(500).json({ message: 'Помилка отримання порогів сенсорів.' });
    }
};

const updateSensorThresholds = async (req, res) => {
    try {
        const { thresholdId, minValue, maxValue } = req.body;
        const [result] = await db.query(
            "UPDATE `SensorThresholds` SET `MinValue` = ?, `MaxValue` = ? WHERE `ThresholdID` = ?;",
            [minValue, maxValue, thresholdId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Поріг не знайдено.' });
        }
        res.status(200).json({ message: 'Поріг успішно оновлено.' });
    } catch (error) {
        console.error('Помилка оновлення порогів сенсорів:', error);
        res.status(500).json({ message: 'Помилка оновлення порогів сенсорів.' });
    }
};

const getReportSettings = async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM ReportSettings');
        res.status(200).json(settings);
    } catch (error) {
        console.error('Помилка отримання налаштувань звітів:', error);
        res.status(500).json({ message: 'Помилка отримання налаштувань звітів.' });
    }
};

const updateReportSettings = async (req, res) => {
    try {
        const { frequency } = req.body;
        const [result] = await db.query('UPDATE ReportSettings SET Frequency = ?', [frequency]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Налаштування не знайдено.' });
        }
        res.status(200).json({ message: 'Налаштування звітів успішно оновлено.' });
    } catch (error) {
        console.error('Помилка оновлення налаштувань звітів:', error);
        res.status(500).json({ message: 'Помилка оновлення налаштувань звітів.' });
    }
};

const getNotificationRules = async (req, res) => {
    try {
        const [rules] = await db.query('SELECT * FROM NotificationRules');
        res.status(200).json(rules);
    } catch (error) {
        console.error('Помилка отримання правил сповіщення:', error);
        res.status(500).json({ message: 'Помилка отримання правил сповіщення.' });
    }
};

const createNotificationRule = async (req, res) => {
    const { rule_name, rule_condition, action } = req.body;

    if (!rule_name || !rule_condition || !action) {
        return res.status(400).json({ message: "Всі поля є обов'язковими: rule_name, rule_condition, action." });
    }

    try {
        await db.query(
            'INSERT INTO NotificationRules (rule_name, rule_condition, action) VALUES (?, ?, ?)', 
            [rule_name, rule_condition, action]
        );
        res.status(201).json({ message: 'Правило сповіщення створене успішно.' });
    } catch (error) {
        console.error('Помилка створення правила сповіщення:', error);
        res.status(500).json({ message: 'Помилка створення правила сповіщення.' });
    }
};

const updateNotificationRule = async (req, res) => {
    const { rule_name, rule_condition, action } = req.body;
    const { id } = req.params; // Беремо id з параметрів URL

    if (!rule_name || !rule_condition || !action) {
        return res.status(400).json({ message: "Всі поля є обов'язковими: rule_name, rule_condition, action." });
    }

    try {
        await db.query(
            'UPDATE NotificationRules SET rule_name = ?, rule_condition = ?, action = ? WHERE id = ?',
            [rule_name, rule_condition, action, id]
        );
        res.status(200).json({ message: 'Правило сповіщення оновлено успішно.' });
    } catch (error) {
        console.error('Помилка оновлення правила сповіщення:', error);
        res.status(500).json({ message: 'Помилка оновлення правила сповіщення.' });
    }
};

const deleteNotificationRule = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM NotificationRules WHERE id = ?', [id]);
        res.status(200).json({ message: 'Правило сповіщення видалено успішно.' });
    } catch (error) {
        console.error('Помилка видалення правила сповіщення:', error);
        res.status(500).json({ message: 'Помилка видалення правила сповіщення.' });
    }
};


// ServiceAdmin функції
const analyzePerformance = async (req, res) => {
    try {
        const [results] = await db.query("SHOW FULL PROCESSLIST");
        res.status(200).json(results);
    } catch (error) {
        console.error("Помилка аналізу продуктивності бази даних:", error);
        res.status(500).json({ message: "Помилка аналізу продуктивності бази даних." });
    }
};

const addSensorHistory = async (req, res) => {
    const { sensorId, parameterName, oldValue, newValue, changedBy } = req.body;

    if (!sensorId || !parameterName || !oldValue || !newValue || !changedBy) {
        return res.status(400).json({ message: "Усі поля є обов'язковими." });
    }

    try {
        const query = `
            INSERT INTO SensorHistory (sensor_id, parameter_name, old_value, new_value, changed_by)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query, [sensorId, parameterName, oldValue, newValue, changedBy]);
        res.status(201).json({ message: "Зміни сенсора успішно записані в історію." });
    } catch (error) {
        console.error("Помилка запису в історію сенсорів:", error);
        res.status(500).json({ message: "Помилка запису в історію сенсорів." });
    }
};

const getSensorHistory = async (req, res) => {
    const { sensorId } = req.params;

    if (!sensorId) {
        return res.status(400).json({ message: "ID сенсора є обов'язковим." });
    }

    try {
        const query = `
            SELECT * FROM SensorHistory WHERE sensor_id = ?
            ORDER BY changed_at DESC
        `;
        const [rows] = await db.query(query, [sensorId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Помилка отримання історії сенсорів:", error);
        res.status(500).json({ message: "Помилка отримання історії сенсорів." });
    }
};

const addAnomalousData = async (req, res) => {
    const { sensorId, dataType, value, anomalyReason } = req.body;

    if (!sensorId || !dataType || !value || !anomalyReason) {
        return res.status(400).json({ message: "Усі поля є обов'язковими." });
    }

    try {
        const query = `
            INSERT INTO AnomalousDataLogs (sensor_id, data_type, value, anomaly_reason)
            VALUES (?, ?, ?, ?)
        `;
        await db.query(query, [sensorId, dataType, value, anomalyReason]);
        res.status(201).json({ message: "Аномальні дані успішно записані." });
    } catch (error) {
        console.error("Помилка запису аномальних даних:", error);
        res.status(500).json({ message: "Помилка запису аномальних даних." });
    }
};

const getAnomalousData = async (req, res) => {
    const { sensorId } = req.params;

    if (!sensorId) {
        return res.status(400).json({ message: "ID сенсора є обов'язковим." });
    }

    try {
        const query = `
            SELECT * FROM AnomalousDataLogs WHERE sensor_id = ?
            ORDER BY recorded_at DESC
        `;
        const [rows] = await db.query(query, [sensorId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Помилка отримання аномальних даних:", error);
        res.status(500).json({ message: "Помилка отримання аномальних даних." });
    }
};

const monitorIoTDevices = async (req, res) => {
    try {
        const [devices] = await db.query('SELECT * FROM IoTDevices');
        res.status(200).json(devices);
    } catch (error) {
        console.error('Помилка отримання списку IoT пристроїв:', error);
        res.status(500).json({ message: 'Помилка отримання списку IoT пристроїв.' });
    }
};

const restartIoTDevice = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Перезапуск IoT-пристрою з ID: ${id}`);
        res.status(200).json({ message: `IoT-пристрій з ID ${id} перезапущено успішно.` });
    } catch (error) {
        console.error('Помилка перезапуску IoT пристрою:', error);
        res.status(500).json({ message: 'Помилка перезапуску IoT пристрою.' });
    }
};


// InfrastructureAdmin функції

// Створення резервної копії бази даних
const createDatabaseBackup = async (req, res) => {
    const timestamp = Date.now();
    const backupFilePath = `./backups/backup_${timestamp}.sql`;
    const command = `docker exec fridge_system_db mysqldump -uroot -pPASSWORD fridge_system > ${backupFilePath}`;

    console.log(`Команда для створення резервної копії: ${command}`);

    try {
        exec(command, async (error) => {
            if (error) {
                console.error("Помилка створення резервної копії:", error);
                return res.status(500).json({ message: "Помилка створення резервної копії." });
            }
            const UserId = req.userId ? req.userId : null;
            await db.query(
                'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
                [UserId, 'BACKUP_DB', `Створено резервну копію бази даних: ${backupFilePath}`]
            );
            res.status(200).json({
                message: "Резервна копія створена успішно.",
                backupPath: backupFilePath,
            });
        });
    } catch (error) {
        console.error("Помилка під час створення резервної копії:", error.message);
        res.status(500).json({ message: "Помилка під час створення резервної копії." });
    }
};

// Відновлення бази даних із резервної копії
const restoreBackup = async (req, res) => {
    const { backupPath } = req.body;

    if (!backupPath) {
        return res.status(400).json({ message: "Шлях до резервної копії є обов'язковим." });
    }

    const command = `docker exec -i fridge_system_db mysql -uroot -pPASSWORD fridge_system < ${backupPath}`;
    console.log(`Команда для відновлення з резервної копії: ${command}`);

    try {
        exec(command, async (error) => {
            if (error) {
                console.error("Помилка відновлення бази даних:", error);
                return res.status(500).json({ message: "Помилка відновлення бази даних." });
            }
            const UserId = req.userId ? req.userId : null;
            await db.query(
                'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
                [UserId, 'RESTORE_DB', `База даних відновлена з резервної копії: ${backupPath}`]
            );
            res.status(200).json({ message: "Базу даних успішно відновлено." });
        });
    } catch (error) {
        console.error("Помилка під час відновлення:", error.message);
        res.status(500).json({ message: "Помилка під час відновлення." });
    }
};

// Управління доступом до бази даних
const manageAccess = async (req, res) => {
    const { action, role, database, username, password } = req.body;

    if (!action || !role || !database || !username) {
        return res.status(400).json({ message: "Необхідно надати всі параметри (action, role, database, username)." });
    }

    const createUserCommand = `CREATE USER IF NOT EXISTS '${username}'@'%' IDENTIFIED BY '${password || 'default_password'}';`;

    const grantCommand =
        action === "grant"
            ? `GRANT ${role} ON ${database}.* TO '${username}'@'%';`
            : `REVOKE ${role} ON ${database}.* FROM '${username}'@'%';`;

    const flushPrivileges = `FLUSH PRIVILEGES;`;

    const fullCommand = `docker exec -i fridge_system_db mysql -uroot -pPASSWORD -e "${createUserCommand} ${grantCommand} ${flushPrivileges}"`;
    console.log(`Команда для управління доступом: ${fullCommand}`);

    try {
        exec(fullCommand, async (error) => {
            if (error) {
                console.error("Помилка управління доступом до бази даних:", error);
                return res.status(500).json({ message: "Помилка управління доступом до бази даних." });
            }
            const UserId = req.userId ? req.userId : null;
            await db.query(
                'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
                [
                    UserId,
                    'MANAGE_ACCESS',
                    `${action === "grant" ? "Надано доступ" : "Знято доступ"} до бази даних ${database} для користувача ${username} з роллю ${role}`
                ]
            );
            res.status(200).json({
                message: `${action === "grant" ? "Доступ надано" : "Доступ знято"} успішно.`,
            });
        });
    } catch (error) {
        console.error("Помилка управління доступом:", error.message);
        res.status(500).json({ message: "Помилка управління доступом." });
    }
};

const migrateDatabase = async (req, res) => {
    try {
        console.log("Запуск міграції бази даних...");
        await db.query('RUN MIGRATIONS');
        const UserId = req.userId ? req.userId : null;
        console.log("User ID:", UserId);
        await db.query(
            'INSERT INTO AdminLogs (admin_id, action, description) VALUES (?, ?, ?)',
            [
                req.user.id,
                'MIGRATE_DB',
                'Міграція бази даних завершена успішно'
            ]
        );
        res.status(200).json({ message: 'Міграція бази даних завершена успішно.' });
    } catch (error) {
        console.error('Помилка під час міграції бази даних:', error);
        res.status(500).json({ message: 'Помилка під час міграції бази даних.' });
    }
};

module.exports = {
    getAlgorithmSettings,
    updateAlgorithmSettings,
    getAllUsers,
    deleteUser,
    getSensorThresholds,
    updateSensorThresholds,
    getReportSettings,
    updateReportSettings,
    analyzePerformance,
    addSensorHistory,
    getSensorHistory,
    addAnomalousData,
    getAnomalousData,
    createDatabaseBackup,
    restoreBackup,
    manageAccess,
    monitorAPIStatus,
    getNotificationRules,
    createNotificationRule,
    updateNotificationRule,
    deleteNotificationRule,
    monitorIoTDevices,
    restartIoTDevice,
    migrateDatabase,
    getConfigurations,
    updateConfiguration,
    generateGeneralReport,
    changeUserRole,
    getAdminLogs,
};