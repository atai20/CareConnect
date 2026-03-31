const chatHandler = require('./chat.handler');
const notificationHandler = require('./notification.handler');
const trackingHandler = require('./tracking.handler');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    // Join user's personal room for targeted notifications
    socket.join(`user:${socket.userId}`);

    // Register namespace handlers
    chatHandler(io, socket);
    notificationHandler(io, socket);
    trackingHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}

module.exports = setupSocketHandlers;
