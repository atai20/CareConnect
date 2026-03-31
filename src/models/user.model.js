const db = require('../config/database');

const TABLE = 'users';

const UserModel = {
  async findById(id) {
    return db(TABLE).where({ id }).first();
  },

  async findByEmail(email) {
    return db(TABLE).where({ email }).first();
  },

  async create(userData) {
    const [id] = await db(TABLE).insert(userData);
    return this.findById(id);
  },

  async update(id, data) {
    await db(TABLE).where({ id }).update(data);
    return this.findById(id);
  },

  async deactivate(id) {
    return db(TABLE).where({ id }).update({ is_active: false });
  },

  async list({ page = 1, limit = 20, role } = {}) {
    const query = db(TABLE).where({ is_active: true });

    if (role) {
      query.where({ role });
    }

    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      query.clone().select('id', 'email', 'first_name', 'last_name', 'role', 'created_at')
        .limit(limit).offset(offset).orderBy('created_at', 'desc'),
      query.clone().count('* as total'),
    ]);

    return { data, total };
  },
};

module.exports = UserModel;
