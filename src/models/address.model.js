const db = require('../config/database');

const AddressModel = {
  async findById(id) {
    return db('addresses').where({ id }).first();
  },

  async listForUser(userId) {
    return db('addresses').where({ user_id: userId }).orderBy('is_default', 'desc');
  },

  async create(data) {
    // If this is set as default, unset other defaults first
    if (data.is_default) {
      await db('addresses').where({ user_id: data.user_id }).update({ is_default: false });
    }
    const [id] = await db('addresses').insert(data);
    return this.findById(id);
  },

  async update(id, data) {
    if (data.is_default) {
      const address = await this.findById(id);
      await db('addresses').where({ user_id: address.user_id }).update({ is_default: false });
    }
    await db('addresses').where({ id }).update(data);
    return this.findById(id);
  },

  async delete(id) {
    return db('addresses').where({ id }).del();
  },
};

module.exports = AddressModel;
