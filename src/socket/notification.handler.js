function notificationHandler(io, socket) {
  // Notifications are primarily server-push (see NotificationService.create)
  // This handler is for client acknowledgments

  socket.on('notification_read', async ({ notificationId }) => {
    try {
      const NotificationService = require('../services/notification.service');
      await NotificationService.markAsRead(notificationId, socket.userId);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
}

module.exports = notificationHandler;
