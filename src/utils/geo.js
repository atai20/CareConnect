/**
 * Geolocation utilities for distance calculation and caregiver matching.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Returns a Knex raw expression for Haversine distance in MySQL.
 * Use in .select() to add a computed distance_km column.
 */
function haversineSQL(latColumn, lonColumn, lat, lon) {
  return `(${EARTH_RADIUS_KM} * ACOS(
    LEAST(1, COS(RADIANS(${lat})) * COS(RADIANS(${latColumn})) *
    COS(RADIANS(${lonColumn}) - RADIANS(${lon})) +
    SIN(RADIANS(${lat})) * SIN(RADIANS(${latColumn})))
  ))`;
}

module.exports = { haversineDistance, haversineSQL, EARTH_RADIUS_KM };
