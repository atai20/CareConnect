const { Router } = require('express');
const reviewController = require('../controllers/review.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const reviewValidation = require('../validations/review.validation');

const router = Router();

router.post('/', authenticate, validate(reviewValidation.createReview), reviewController.create);

// GET /reviews/caregiver/:id — list all reviews for a specific caregiver
router.get('/caregiver/:id', authenticate, reviewController.listForCaregiver);

router.get('/:id', authenticate, reviewController.getById);
router.patch('/:id', authenticate, validate(reviewValidation.updateReview), reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);

module.exports = router;
