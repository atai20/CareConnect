const db = require('../config/database');

const ReviewModel = {
  async findById(id) {
    return db('reviews as r')
      .join('users as reviewer', 'r.reviewer_id', 'reviewer.id')
      .where('r.id', id)
      .select('r.*', 'reviewer.first_name as reviewer_first_name', 'reviewer.last_name as reviewer_last_name')
      .first();
  },

  async findByAppointmentId(appointmentId) {
    return db('reviews').where({ appointment_id: appointmentId }).first();
  },

  async create(data) {
    const [id] = await db('reviews').insert(data);
    return this.findById(id);
  },

  async update(id, data) {
    await db('reviews').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('reviews').where({ id }).del();
  },

  async listForUser(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const query = db('reviews').where({ reviewee_id: userId });

    const [data, [{ total }]] = await Promise.all([
      query.clone().limit(limit).offset(offset).orderBy('created_at', 'desc'),
      query.clone().count('* as total'),
    ]);

    return { data, total };
  },
};

module.exports = ReviewModel;
