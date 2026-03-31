const db = require('../config/database');

const MessageModel = {
  async create(data) {
    const [id] = await db('messages').insert(data);
    return db('messages as m')
      .join('users as u', 'm.sender_id', 'u.id')
      .where('m.id', id)
      .select('m.*', 'u.first_name as sender_first_name', 'u.last_name as sender_last_name', 'u.avatar_url as sender_avatar')
      .first();
  },

  async listByConversation(conversationId, { page = 1, limit = 50 } = {}) {
    const offset = (page - 1) * limit;

    const [data, [{ total }]] = await Promise.all([
      db('messages as m')
        .join('users as u', 'm.sender_id', 'u.id')
        .where('m.conversation_id', conversationId)
        .select('m.*', 'u.first_name as sender_first_name', 'u.last_name as sender_last_name', 'u.avatar_url as sender_avatar')
        .orderBy('m.created_at', 'desc')
        .limit(limit).offset(offset),
      db('messages').where({ conversation_id: conversationId }).count('* as total'),
    ]);

    return { data: data.reverse(), total }; // Reverse so oldest first in page
  },

  async markAsRead(conversationId, userId) {
    return db('messages')
      .where({ conversation_id: conversationId, is_read: false })
      .whereNot({ sender_id: userId })
      .update({ is_read: true });
  },
};

module.exports = MessageModel;
