const db = require('../config/database');

const ConversationModel = {
  async findById(id) {
    return db('conversations').where({ id }).first();
  },

  async create(appointmentId) {
    const [id] = await db('conversations').insert({ appointment_id: appointmentId });
    return this.findById(id);
  },

  async addParticipant(conversationId, userId) {
    await db('conversation_participants')
      .insert({ conversation_id: conversationId, user_id: userId })
      .onConflict(['conversation_id', 'user_id'])
      .ignore();
  },

  async isParticipant(conversationId, userId) {
    const row = await db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: userId })
      .first();
    return !!row;
  },

  async listForUser(userId) {
    return db('conversations as c')
      .join('conversation_participants as cp', 'c.id', 'cp.conversation_id')
      .where('cp.user_id', userId)
      .select('c.*')
      .orderBy('c.created_at', 'desc');
  },

  async getParticipants(conversationId) {
    return db('conversation_participants as cp')
      .join('users as u', 'cp.user_id', 'u.id')
      .where('cp.conversation_id', conversationId)
      .select('u.id', 'u.first_name', 'u.last_name', 'u.avatar_url');
  },
};

module.exports = ConversationModel;
