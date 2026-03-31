const NotificationModel = require('../models/notification.model');

const NotificationService = {
  async create({ userId, type, title, body, data }) {
    const notification = await NotificationModel.create({
      user_id: userId,
      type,
      title,
      body,
      data: data ? JSON.stringify(data) : null,
    });

    // Emit via WebSocket if user is online
    try {
      const { getIO } = require('../config/socket');
      const io = getIO();
      io.to(`user:${userId}`).emit('new_notification', notification);
    } catch (e) {
      // Socket not initialized — that's fine, notification is still in DB
    }

    return notification;
  },

  async list(userId, options) {
    return NotificationModel.listForUser(userId, options);
  },

  async markAsRead(id, userId) {
    return NotificationModel.markAsRead(id, userId);
  },

  async markAllAsRead(userId) {
    return NotificationModel.markAllAsRead(userId);
  },

  async getUnreadCount(userId) {
    return NotificationModel.getUnreadCount(userId);
  },
};

module.exports = NotificationService;
