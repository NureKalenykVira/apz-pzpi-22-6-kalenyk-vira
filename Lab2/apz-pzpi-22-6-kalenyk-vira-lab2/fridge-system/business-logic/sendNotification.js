const sendNotification = async (userId, notification) => {
    console.log(`Notification sent to User ID ${userId}:`, notification);
    return true;
};

module.exports = sendNotification;