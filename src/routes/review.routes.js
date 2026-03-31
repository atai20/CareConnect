const { Router } = require('express');
const reviewController = require('../controllers/review.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const reviewValidation = require('../validations/review.validation');

const router = Router();

router.post('/', authenticate, validate(reviewValidation.createReview), reviewController.create);
router.get('/:id', authenticate, reviewController.getById);
router.patch('/:id', authenticate, validate(reviewValidation.updateReview), reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);

module.exports = router;
