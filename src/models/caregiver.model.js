const db = require('../config/database');

const CaregiverModel = {
  async findByUserId(userId) {
    return db('caregiver_profiles').where({ user_id: userId }).first();
  },

  async findById(id) {
    return db('caregiver_profiles as cp')
      .join('users as u', 'cp.user_id', 'u.id')
      .where('cp.id', id)
      .select(
        'cp.*',
        'u.first_name', 'u.last_name', 'u.email', 'u.phone', 'u.avatar_url'
      )
      .first();
  },

  async create(profileData) {
    const [id] = await db('caregiver_profiles').insert(profileData);
    return this.findById(id);
  },

  async update(id, data) {
    await db('caregiver_profiles').where({ id }).update(data);
    return this.findById(id);
  },

  async getCertifications(caregiverId) {
    return db('caregiver_certifications as cc')
      .join('certifications as c', 'cc.certification_id', 'c.id')
      .where('cc.caregiver_id', caregiverId)
      .select('cc.*', 'c.name', 'c.abbreviation', 'c.level');
  },

  async addCertification(data) {
    const [id] = await db('caregiver_certifications').insert(data);
    return db('caregiver_certifications').where({ id }).first();
  },

  async removeCertification(caregiverId, certId) {
    return db('caregiver_certifications')
      .where({ caregiver_id: caregiverId, id: certId })
      .del();
  },

  async getAvailability(caregiverId) {
    return db('caregiver_availability')
      .where({ caregiver_id: caregiverId })
      .orderBy('day_of_week')
      .orderBy('start_time');
  },

  async setAvailability(caregiverId, slots) {
    await db.transaction(async (trx) => {
      await trx('caregiver_availability').where({ caregiver_id: caregiverId }).del();
      if (slots.length > 0) {
        const rows = slots.map((s) => ({ caregiver_id: caregiverId, ...s }));
        await trx('caregiver_availability').insert(rows);
      }
    });
    return this.getAvailability(caregiverId);
  },

  async search({ lat, lon, serviceLevel, dayOfWeek, page = 1, limit = 20 } = {}) {
    const query = db('caregiver_profiles as cp')
      .join('users as u', 'cp.user_id', 'u.id')
      .where('cp.is_verified', true)
      .where('u.is_active', true);

    if (serviceLevel) {
      query.whereExists(function () {
        this.select('*')
          .from('caregiver_certifications as cc')
          .join('certifications as c', 'cc.certification_id', 'c.id')
          .whereRaw('cc.caregiver_id = cp.id')
          .where('c.level', serviceLevel);
      });
    }

    if (dayOfWeek !== undefined) {
      query.whereExists(function () {
        this.select('*')
          .from('caregiver_availability as ca')
          .whereRaw('ca.caregiver_id = cp.id')
          .where('ca.day_of_week', dayOfWeek);
      });
    }

    const selectFields = [
      'cp.id', 'cp.user_id', 'cp.bio', 'cp.hourly_rate', 'cp.years_experience',
      'cp.average_rating', 'cp.total_reviews', 'cp.service_radius_km',
      'u.first_name', 'u.last_name', 'u.avatar_url',
    ];

    // If coordinates provided, add distance calculation
    if (lat && lon) {
      const haversine = `(6371 * ACOS(LEAST(1,
        COS(RADIANS(?)) * COS(RADIANS(a.latitude)) *
        COS(RADIANS(a.longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
      )))`;

      query
        .join('addresses as a', function () {
          this.on('a.user_id', 'u.id').andOn('a.is_default', db.raw('TRUE'));
        })
        .select(...selectFields, db.raw(`${haversine} AS distance_km`, [lat, lon, lat]))
        .havingRaw('distance_km <= cp.service_radius_km')
        .orderBy('distance_km', 'asc');
    } else {
      query.select(...selectFields).orderBy('cp.average_rating', 'desc');
    }

    const offset = (page - 1) * limit;
    const data = await query.limit(limit).offset(offset);
    return data;
  },

  async updateRating(caregiverId) {
    const result = await db('reviews as r')
      .join('appointments as a', 'r.appointment_id', 'a.id')
      .where('a.caregiver_id', caregiverId)
      .avg('r.overall_rating as avg_rating')
      .count('* as total')
      .first();

    await db('caregiver_profiles').where({ id: caregiverId }).update({
      average_rating: result.avg_rating || 0,
      total_reviews: result.total || 0,
    });
  },
};

module.exports = CaregiverModel;
