const AddressModel = require('../models/address.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * Transforms camelCase request body keys to snake_case DB column names.
 *
 * WHY THIS EXISTS:
 * Our API accepts camelCase (JSON convention) but our MySQL columns use
 * snake_case (SQL convention). Joi validates the camelCase shape, then
 * this function maps to DB columns before Knex tries to insert/update.
 *
 * Alternative approaches:
 * 1. Use Knex's postProcessResponse/wrapIdentifier for automatic conversion
 *    (global, affects every query — risky in a team project)
 * 2. Accept snake_case in the API (ugly for frontend devs)
 * 3. Use an ORM like Sequelize that handles this (heavy dependency)
 *
 * We chose explicit mapping: simple, no magic, easy to debug.
 */
function toDbFields(body) {
  const map = {
    streetAddress: 'street_address',
    aptUnit: 'apt_unit',
    zipCode: 'zip_code',
    isDefault: 'is_default',
  };

  const result = {};
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;
    result[map[key] || key] = value;
  }
  return result;
}

const list = catchAsync(async (req, res) => {
  const addresses = await AddressModel.listForUser(req.user.id);
  res.json({ status: 200, data: addresses });
});

const create = catchAsync(async (req, res) => {
  const dbData = toDbFields(req.body);
  const address = await AddressModel.create({ user_id: req.user.id, ...dbData });
  res.status(201).json({ status: 201, data: address });
});

const update = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest('Invalid address ID');

  const address = await AddressModel.findById(id);
  if (!address) throw ApiError.notFound('Address not found');
  if (address.user_id !== req.user.id) throw ApiError.forbidden();

  const dbData = toDbFields(req.body);
  const updated = await AddressModel.update(id, dbData);
  res.json({ status: 200, data: updated });
});

const remove = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest('Invalid address ID');

  const address = await AddressModel.findById(id);
  if (!address) throw ApiError.notFound('Address not found');
  if (address.user_id !== req.user.id) throw ApiError.forbidden();

  await AddressModel.delete(id);
  res.status(204).send();
});

module.exports = { list, create, update, remove };
