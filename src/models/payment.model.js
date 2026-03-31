const db = require('../config/database');

const PaymentModel = {
  async findById(id) {
    return db('payments').where({ id }).first();
  },

  async findByAppointmentId(appointmentId) {
    return db('payments').where({ appointment_id: appointmentId }).first();
  },

  async create(data) {
    const [id] = await db('payments').insert(data);
    return this.findById(id);
  },

  async update(id, data) {
    await db('payments').where({ id }).update(data);
    return this.findById(id);
  },

  async listForUser(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const query = db('payments')
      .where({ payer_id: userId })
      .orWhere({ payee_id: userId });

    const [data, [{ total }]] = await Promise.all([
      query.clone().limit(limit).offset(offset).orderBy('created_at', 'desc'),
      query.clone().count('* as total'),
    ]);

    return { data, total };
  },

  // Payment methods
  async addPaymentMethod(data) {
    const [id] = await db('payment_methods').insert(data);
    return db('payment_methods').where({ id }).first();
  },

  async getPaymentMethods(userId) {
    return db('payment_methods').where({ user_id: userId });
  },

  async removePaymentMethod(userId, methodId) {
    return db('payment_methods').where({ user_id: userId, id: methodId }).del();
  },
};

module.exports = PaymentModel;
