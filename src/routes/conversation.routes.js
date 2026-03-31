const { Router } = require('express');
const conversationController = require('../controllers/conversation.controller');
const authenticate = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, conversationController.list);
router.get('/:id/messages', authenticate, conversationController.getMessages);
router.post('/:id/messages', authenticate, conversationController.sendMessage);

module.exports = router;
