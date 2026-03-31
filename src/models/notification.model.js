const db = require('../config/database');

const NotificationModel = {
  async create(data) {
    const [id] = await db('notifications').insert(data);
    return db('notifications').where({ id }).first();
  },

  async listForUser(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const offset = (page - 1) * limit;
    const query = db('notifications').where({ user_id: userId });

    if (unreadOnly) {
      query.where({ is_read: false });
    }

    const [data, [{ total }]] = await Promise.all([
      query.clone().limit(limit).offset(offset).orderBy('created_at', 'desc'),
      query.clone().count('* as total'),
    ]);

    return { data, total };
  },

  async markAsRead(id, userId) {
    return db('notifications').where({ id, user_id: userId }).update({ is_read: true });
  },

  async markAllAsRead(userId) {
    return db('notifications')
      .where({ user_id: userId, is_read: false })
      .update({ is_read: true });
  },

  async getUnreadCount(userId) {
    const [{ count }] = await db('notifications')
      .where({ user_id: userId, is_read: false })
      .count('* as count');
    return count;
  },
};

module.exports = NotificationModel;
