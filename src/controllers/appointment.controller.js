const AppointmentService = require('../services/appointment.service');
const catchAsync = require('../utils/catchAsync');
const { buildPaginationResponse, parsePaginationParams } = require('../utils/pagination');

const create = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.create(req.user.id, req.body);
  res.status(201).json({ status: 201, data: appointment });
});

const list = catchAsync(async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const { data, total } = await AppointmentService.list(req.user.id, req.user.role, {
    ...req.query, page, limit,
  });
  res.json({ status: 200, ...buildPaginationResponse(data, total, page, limit) });
});

const getById = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.getById(req.params.id);
  res.json({ status: 200, data: appointment });
});

const update = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.update(req.params.id, req.body);
  res.json({ status: 200, data: appointment });
});

const accept = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.accept(req.params.id, req.user.id);
  res.json({ status: 200, data: appointment, message: 'Appointment accepted' });
});

const decline = catchAsync(async (req, res) => {
  await AppointmentService.decline(req.params.id, req.user.id);
  res.json({ status: 200, message: 'Appointment declined' });
});

const start = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.start(req.params.id, req.user.id);
  res.json({ status: 200, data: appointment, message: 'Appointment started' });
});

const complete = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.complete(req.params.id, req.user.id);
  res.json({ status: 200, data: appointment, message: 'Appointment completed' });
});

const cancel = catchAsync(async (req, res) => {
  const appointment = await AppointmentService.cancel(
    req.params.id, req.user.id, req.body.cancellationReason
  );
  res.json({ status: 200, data: appointment, message: 'Appointment cancelled' });
});

const getTasks = catchAsync(async (req, res) => {
  const tasks = await AppointmentService.getTasks(req.params.id);
  res.json({ status: 200, data: tasks });
});

const addTask = catchAsync(async (req, res) => {
  const task = await AppointmentService.addTask(req.params.id, req.body);
  res.status(201).json({ status: 201, data: task });
});

const toggleTask = catchAsync(async (req, res) => {
  const task = await AppointmentService.toggleTask(req.params.taskId, req.body.isCompleted);
  res.json({ status: 200, data: task });
});

module.exports = { create, list, getById, update, accept, decline, start, complete, cancel, getTasks, addTask, toggleTask };
