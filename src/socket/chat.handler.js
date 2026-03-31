const ChatService = require('../services/chat.service');

function chatHandler(io, socket) {
  socket.on('join_conversation', async ({ conversationId }) => {
    try {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('send_message', async ({ conversationId, content, type }) => {
    try {
      const message = await ChatService.sendMessage(conversationId, socket.userId, content, type);

      // Broadcast to all participants in the conversation
      io.to(`conversation:${conversationId}`).emit('new_message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('typing', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      conversationId,
    });
  });

  socket.on('stop_typing', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
      userId: socket.userId,
      conversationId,
    });
  });
}

module.exports = chatHandler;
