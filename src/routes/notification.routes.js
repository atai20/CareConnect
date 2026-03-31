const { Router } = require('express');
const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, notificationController.list);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.post('/read-all', authenticate, notificationController.markAllAsRead);

module.exports = router;
