const { Router } = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = Router();

router.get('/', authenticate, authorize('admin'), userController.list);
router.get('/:id', authenticate, userController.getById);
router.patch('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.deactivate);

module.exports = router;
