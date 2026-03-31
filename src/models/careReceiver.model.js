const db = require('../config/database');

const CareReceiverModel = {
  async findByUserId(userId) {
    return db('care_receiver_profiles').where({ user_id: userId }).first();
  },

  async findById(id) {
    return db('care_receiver_profiles as crp')
      .join('users as u', 'crp.user_id', 'u.id')
      .where('crp.id', id)
      .select('crp.*', 'u.first_name', 'u.last_name', 'u.email', 'u.phone')
      .first();
  },

  async create(profileData) {
    const [id] = await db('care_receiver_profiles').insert(profileData);
    return this.findById(id);
  },

  async update(id, data) {
    await db('care_receiver_profiles').where({ id }).update(data);
    return this.findById(id);
  },

  async getInsurance(careReceiverId) {
    return db('insurance_policies').where({ care_receiver_id: careReceiverId });
  },

  async addInsurance(data) {
    const [id] = await db('insurance_policies').insert(data);
    return db('insurance_policies').where({ id }).first();
  },

  async removeInsurance(careReceiverId, policyId) {
    return db('insurance_policies')
      .where({ care_receiver_id: careReceiverId, id: policyId })
      .del();
  },
};

module.exports = CareReceiverModel;
