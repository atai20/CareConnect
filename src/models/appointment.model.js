const db = require('../config/database');

const AppointmentModel = {
  async findById(id) {
    return db('appointments as a')
      .leftJoin('service_types as st', 'a.service_type_id', 'st.id')
      .leftJoin('addresses as addr', 'a.address_id', 'addr.id')
      .where('a.id', id)
      .select(
        'a.*',
        'st.name as service_name', 'st.base_hourly_rate',
        'addr.street_address', 'addr.city', 'addr.state', 'addr.zip_code',
        'addr.latitude', 'addr.longitude'
      )
      .first();
  },

  async create(data) {
    const [id] = await db('appointments').insert(data);
    return this.findById(id);
  },

  async update(id, data) {
    await db('appointments').where({ id }).update(data);
    return this.findById(id);
  },

  async listForUser(userId, role, { status, page = 1, limit = 20, sortBy = 'scheduled_start', order = 'desc' } = {}) {
    const query = db('appointments as a')
      .leftJoin('service_types as st', 'a.service_type_id', 'st.id')
      .leftJoin('caregiver_profiles as cp', 'a.caregiver_id', 'cp.id')
      .leftJoin('users as cgu', 'cp.user_id', 'cgu.id')
      .leftJoin('care_receiver_profiles as crp', 'a.care_receiver_id', 'crp.id')
      .leftJoin('users as cru', 'crp.user_id', 'cru.id');

    if (role === 'caregiver') {
      const profile = await db('caregiver_profiles').where({ user_id: userId }).first();
      if (profile) {
        query.where('a.caregiver_id', profile.id);
      }
    } else if (role === 'care_receiver') {
      const profile = await db('care_receiver_profiles').where({ user_id: userId }).first();
      if (profile) {
        query.where('a.care_receiver_id', profile.id);
      }
    }
    // Admin sees all — no filter

    if (status) {
      query.where('a.status', status);
    }

    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      query.clone()
        .select(
          'a.*',
          'st.name as service_name',
          'cgu.first_name as caregiver_first_name', 'cgu.last_name as caregiver_last_name',
          'cru.first_name as receiver_first_name', 'cru.last_name as receiver_last_name'
        )
        .orderBy(`a.${sortBy}`, order)
        .limit(limit).offset(offset),
      query.clone().count('* as total'),
    ]);

    return { data, total };
  },

  async getTasks(appointmentId) {
    return db('appointment_tasks')
      .where({ appointment_id: appointmentId })
      .orderBy('sort_order');
  },

  async addTask(data) {
    const [id] = await db('appointment_tasks').insert(data);
    return db('appointment_tasks').where({ id }).first();
  },

  async updateTask(taskId, data) {
    await db('appointment_tasks').where({ id: taskId }).update(data);
    return db('appointment_tasks').where({ id: taskId }).first();
  },

  async findPendingByServiceLevel(serviceLevel) {
    return db('appointments as a')
      .join('service_types as st', 'a.service_type_id', 'st.id')
      .where('a.status', 'pending')
      .where('st.required_certification_level', serviceLevel)
      .whereNull('a.caregiver_id')
      .select('a.*', 'st.name as service_name')
      .orderBy('a.created_at', 'asc');
  },
};

module.exports = AppointmentModel;
