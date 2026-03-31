require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const { initializeSocket } = require('./src/config/socket');
const setupSocketHandlers = require('./src/socket');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Create HTTP server (needed for Socket.io to attach to)
const server = http.createServer(app);

// Initialize WebSocket
const io = initializeSocket(server);
setupSocketHandlers(io);

// Verify database connection, then start server
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connected');
    server.listen(PORT, () => {
      console.log(`
  ╔══════════════════════════════════════════╗
  ║          CareConnect API Server          ║
  ╠══════════════════════════════════════════╣
  ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║
  ║  Port:        ${String(PORT).padEnd(25)}║
  ║  API:         http://localhost:${PORT}/api/v1  ║
  ║  Docs:        http://localhost:${PORT}/api/docs║
  ║  Health:      http://localhost:${PORT}/health  ║
  ║  WebSocket:   ws://localhost:${PORT}           ║
  ╚══════════════════════════════════════════╝
      `);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.error('Make sure MySQL is running and .env is configured correctly.');
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    db.destroy();
    process.exit(0);
  });
});
