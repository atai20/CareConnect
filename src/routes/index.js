const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/caregivers', require('./caregiver.routes'));
router.use('/appointments', require('./appointment.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/conversations', require('./conversation.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/addresses', require('./address.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
