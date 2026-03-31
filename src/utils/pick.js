/**
 * Create an object with only the specified keys from the source.
 * Useful for extracting query params: pick(req.query, ['page', 'limit', 'sortBy'])
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
