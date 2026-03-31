const ChatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');

const list = catchAsync(async (req, res) => {
  const conversations = await ChatService.listConversations(req.user.id);
  res.json({ status: 200, data: conversations });
});

const getMessages = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await ChatService.getMessages(req.params.id, req.user.id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 50,
  });
  res.json({ status: 200, ...result });
});

const sendMessage = catchAsync(async (req, res) => {
  const message = await ChatService.sendMessage(
    req.params.id, req.user.id, req.body.content, req.body.type
  );
  res.status(201).json({ status: 201, data: message });
});

module.exports = { list, getMessages, sendMessage };
