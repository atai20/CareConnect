/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('service_types').del();

  await knex('service_types').insert([
    { name: 'Basic Care (CNA)', description: 'Personal care, bathing, dressing, mobility assistance, meal preparation, companionship.', base_hourly_rate: 35.00, required_certification_level: 'CNA' },
    { name: 'Advanced Care (RNA)', description: 'Medication management, wound care, vital signs monitoring, post-surgical care.', base_hourly_rate: 55.00, required_certification_level: 'RNA' },
    { name: 'Specialized Care (NP)', description: 'Health assessments, prescription management, chronic disease management, telehealth follow-ups.', base_hourly_rate: 85.00, required_certification_level: 'NP' },
    { name: 'Overnight Care (CNA)', description: '8-12 hour overnight monitoring, assistance with nighttime needs, emergency response.', base_hourly_rate: 30.00, required_certification_level: 'CNA' },
    { name: 'Respite Care (CNA)', description: 'Temporary relief for primary caregivers, full personal care coverage.', base_hourly_rate: 35.00, required_certification_level: 'CNA' },
  ]);
};
