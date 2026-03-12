const Notification = require('../models/Notification');

const createNotification = async (recipientId, title, message, type = 'system', link = '') => {
  try {
    await Notification.create({ recipient: recipientId, title, message, type, isRead: false, link });
  } catch (err) {
    console.error('Notification failed silently:', err.message);
  }
};

module.exports = { createNotification };
