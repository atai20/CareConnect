/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('certifications').del();

  await knex('certifications').insert([
    { name: 'Certified Nursing Assistant', abbreviation: 'CNA', level: 'CNA', description: 'Provides basic patient care under the supervision of nursing staff.' },
    { name: 'Registered Nursing Assistant', abbreviation: 'RNA', level: 'RNA', description: 'Provides advanced nursing assistance with medication administration capabilities.' },
    { name: 'Nurse Practitioner', abbreviation: 'NP', level: 'NP', description: 'Advanced practice registered nurse with prescriptive authority.' },
    { name: 'Home Health Aide', abbreviation: 'HHA', level: 'CNA', description: 'Provides personal care services in the home setting.' },
    { name: 'CPR/First Aid Certification', abbreviation: 'CPR', level: 'other', description: 'Basic life support and first aid certification.' },
  ]);
};
