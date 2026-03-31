const db = require('../config/database');

function trackingHandler(io, socket) {
  // Only caregivers emit location updates
  socket.on('update_location', async ({ appointmentId, latitude, longitude }) => {
    if (socket.userRole !== 'caregiver') return;

    try {
      // Get caregiver profile
      const profile = await db('caregiver_profiles').where({ user_id: socket.userId }).first();
      if (!profile) return;

      // Store location
      await db('caregiver_locations').insert({
        caregiver_id: profile.id,
        latitude,
        longitude,
      });

      // Broadcast to appointment room (care receiver will be listening)
      io.to(`appointment:${appointmentId}`).emit('location_update', {
        caregiverId: profile.id,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Care receivers join an appointment tracking room
  socket.on('track_appointment', ({ appointmentId }) => {
    socket.join(`appointment:${appointmentId}`);
  });
}

module.exports = trackingHandler;
