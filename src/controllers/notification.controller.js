const NotificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const { buildPaginationResponse, parsePaginationParams } = require('../utils/pagination');

const list = catchAsync(async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const { data, total } = await NotificationService.list(req.user.id, {
    page, limit, unreadOnly: req.query.unreadOnly === 'true',
  });
  res.json({ status: 200, ...buildPaginationResponse(data, total, page, limit) });
});

const markAsRead = catchAsync(async (req, res) => {
  await NotificationService.markAsRead(req.params.id, req.user.id);
  res.status(204).send();
});

const markAllAsRead = catchAsync(async (req, res) => {
  await NotificationService.markAllAsRead(req.user.id);
  res.status(204).send();
});

module.exports = { list, markAsRead, markAllAsRead };
