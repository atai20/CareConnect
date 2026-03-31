const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear tables in correct order (respect FK constraints)
  await knex('caregiver_certifications').del();
  await knex('caregiver_availability').del();
  await knex('caregiver_profiles').del();
  await knex('care_receiver_profiles').del();
  await knex('addresses').del();
  await knex('users').del();

  const hash = await bcrypt.hash('Password123!', 12);

  // Create demo users
  const [adminId] = await knex('users').insert({
    email: 'admin@careconnect.com', password_hash: hash,
    first_name: 'Admin', last_name: 'User', role: 'admin',
  });

  const [caregiver1Id] = await knex('users').insert({
    email: 'maria.garcia@example.com', password_hash: hash,
    first_name: 'Maria', last_name: 'Garcia', phone: '212-555-0101', role: 'caregiver',
  });

  const [caregiver2Id] = await knex('users').insert({
    email: 'james.wilson@example.com', password_hash: hash,
    first_name: 'James', last_name: 'Wilson', phone: '212-555-0102', role: 'caregiver',
  });

  const [receiverId] = await knex('users').insert({
    email: 'dorothy.chen@example.com', password_hash: hash,
    first_name: 'Dorothy', last_name: 'Chen', phone: '212-555-0201', role: 'care_receiver',
  });

  // Create caregiver profiles
  const [cg1ProfileId] = await knex('caregiver_profiles').insert({
    user_id: caregiver1Id, bio: 'Compassionate CNA with 8 years of home care experience. Specialized in elderly care and mobility assistance.',
    hourly_rate: 38.00, years_experience: 8, is_verified: true,
    background_check_status: 'approved', average_rating: 4.85, total_reviews: 47, service_radius_km: 15,
  });

  const [cg2ProfileId] = await knex('caregiver_profiles').insert({
    user_id: caregiver2Id, bio: 'Registered Nurse with expertise in post-surgical care and chronic disease management.',
    hourly_rate: 60.00, years_experience: 12, is_verified: true,
    background_check_status: 'approved', average_rating: 4.92, total_reviews: 31, service_radius_km: 20,
  });

  // Create care receiver profile
  await knex('care_receiver_profiles').insert({
    user_id: receiverId, date_of_birth: '1948-03-15', sex: 'female',
    emergency_contact_name: 'Michael Chen', emergency_contact_phone: '212-555-0202',
  });

  // Link certifications
  await knex('caregiver_certifications').insert([
    { caregiver_id: cg1ProfileId, certification_id: 1, license_number: 'CNA-NY-2018-4521', issued_date: '2018-06-01', expiry_date: '2027-06-01', verified: true },
    { caregiver_id: cg1ProfileId, certification_id: 5, issued_date: '2024-01-15', expiry_date: '2026-01-15', verified: true },
    { caregiver_id: cg2ProfileId, certification_id: 2, license_number: 'RNA-NY-2014-8832', issued_date: '2014-09-01', expiry_date: '2026-09-01', verified: true },
  ]);

  // Set availability
  await knex('caregiver_availability').insert([
    { caregiver_id: cg1ProfileId, day_of_week: 1, start_time: '08:00', end_time: '18:00' },
    { caregiver_id: cg1ProfileId, day_of_week: 2, start_time: '08:00', end_time: '18:00' },
    { caregiver_id: cg1ProfileId, day_of_week: 3, start_time: '08:00', end_time: '18:00' },
    { caregiver_id: cg1ProfileId, day_of_week: 4, start_time: '08:00', end_time: '18:00' },
    { caregiver_id: cg1ProfileId, day_of_week: 5, start_time: '08:00', end_time: '14:00' },
    { caregiver_id: cg2ProfileId, day_of_week: 1, start_time: '09:00', end_time: '17:00' },
    { caregiver_id: cg2ProfileId, day_of_week: 3, start_time: '09:00', end_time: '17:00' },
    { caregiver_id: cg2ProfileId, day_of_week: 5, start_time: '09:00', end_time: '17:00' },
  ]);

  // Add addresses
  await knex('addresses').insert([
    { user_id: caregiver1Id, label: 'home', street_address: '456 Park Ave', city: 'New York', state: 'NY', zip_code: '10022', latitude: 40.7614, longitude: -73.9716, is_default: true },
    { user_id: caregiver2Id, label: 'home', street_address: '789 Broadway', city: 'New York', state: 'NY', zip_code: '10003', latitude: 40.7317, longitude: -73.9927, is_default: true },
    { user_id: receiverId, label: 'home', street_address: '123 Main St', apt_unit: 'Apt 4B', city: 'New York', state: 'NY', zip_code: '10001', latitude: 40.7484, longitude: -73.9967, is_default: true },
  ]);
};
