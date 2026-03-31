const { Router } = require('express');
const addressController = require('../controllers/address.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAddress } = require('../validations/common.validation');

const router = Router();

router.get('/', authenticate, addressController.list);
router.post('/', authenticate, validate(createAddress), addressController.create);
router.patch('/:id', authenticate, addressController.update);
router.delete('/:id', authenticate, addressController.remove);

module.exports = router;
