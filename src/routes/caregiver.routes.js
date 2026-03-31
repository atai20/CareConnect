const { Router } = require('express');
const caregiverController = require('../controllers/caregiver.controller');
const authenticate = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, caregiverController.search);
router.get('/:id', authenticate, caregiverController.getById);
router.post('/:id/certifications', authenticate, caregiverController.addCertification);
router.delete('/:id/certifications/:certId', authenticate, caregiverController.removeCertification);
router.get('/:id/availability', authenticate, caregiverController.getAvailability);
router.put('/:id/availability', authenticate, caregiverController.setAvailability);

module.exports = router;
