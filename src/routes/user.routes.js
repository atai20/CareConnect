const { Router } = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = Router();

router.get('/', authenticate, authorize('admin'), userController.list);

// GET /users/profile — must be ABOVE /:id so "profile" isn't parsed as an id
router.get('/profile', authenticate, userController.getProfile);

router.get('/:id', authenticate, userController.getById);
router.patch('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.deactivate);

module.exports = router;
