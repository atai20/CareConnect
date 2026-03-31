const { Router } = require('express');
const appointmentController = require('../controllers/appointment.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const appointmentValidation = require('../validations/appointment.validation');

const router = Router();

router.post('/', authenticate, validate(appointmentValidation.createAppointment), appointmentController.create);
router.get('/', authenticate, validate(appointmentValidation.listAppointments), appointmentController.list);
router.get('/:id', authenticate, appointmentController.getById);
router.patch('/:id', authenticate, validate(appointmentValidation.updateAppointment), appointmentController.update);
router.post('/:id/accept', authenticate, appointmentController.accept);
router.post('/:id/decline', authenticate, appointmentController.decline);
router.post('/:id/start', authenticate, appointmentController.start);
router.post('/:id/complete', authenticate, appointmentController.complete);
router.post('/:id/cancel', authenticate, appointmentController.cancel);
router.get('/:id/tasks', authenticate, appointmentController.getTasks);
router.post('/:id/tasks', authenticate, appointmentController.addTask);
router.patch('/:id/tasks/:taskId', authenticate, appointmentController.toggleTask);

module.exports = router;
