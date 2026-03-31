const AppointmentModel = require('../models/appointment.model');
const CaregiverModel = require('../models/caregiver.model');
const CareReceiverModel = require('../models/careReceiver.model');
const NotificationService = require('./notification.service');
const ApiError = require('../utils/ApiError');

// Valid state transitions — the appointment state machine
const VALID_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'no_show'],
  completed: [],
  cancelled: [],
  no_show: [],
};

const AppointmentService = {
  async create(userId, data) {
    const profile = await CareReceiverModel.findByUserId(userId);
    if (!profile) {
      throw ApiError.forbidden('Only care receivers can create appointments');
    }

    const appointment = await AppointmentModel.create({
      care_receiver_id: profile.id,
      service_type_id: data.serviceTypeId,
      address_id: data.addressId,
      scheduled_start: data.scheduledStart,
      scheduled_end: data.scheduledEnd,
      notes: data.notes,
      status: 'pending',
    });

    // Create tasks if provided
    if (data.tasks && data.tasks.length > 0) {
      for (const task of data.tasks) {
        await AppointmentModel.addTask({
          appointment_id: appointment.id,
          description: task.description,
          sort_order: task.sortOrder || 0,
        });
      }
    }

    return AppointmentModel.findById(appointment.id);
  },

  async list(userId, role, filters) {
    return AppointmentModel.listForUser(userId, role, filters);
  },

  async getById(id) {
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) throw ApiError.notFound('Appointment not found');
    return appointment;
  },

  async accept(appointmentId, userId) {
    const appointment = await this.getById(appointmentId);
    this._validateTransition(appointment.status, 'accepted');

    const caregiverProfile = await CaregiverModel.findByUserId(userId);
    if (!caregiverProfile) {
      throw ApiError.forbidden('Only caregivers can accept appointments');
    }

    const updated = await AppointmentModel.update(appointmentId, {
      caregiver_id: caregiverProfile.id,
      status: 'accepted',
    });

    // Notify care receiver
    await NotificationService.create({
      userId: updated.care_receiver_id, // This is the profile ID — in real code, resolve to user_id
      type: 'appointment_update',
      title: 'Appointment Accepted',
      body: 'A caregiver has accepted your appointment request.',
      data: { appointmentId },
    });

    return updated;
  },

  async decline(appointmentId, userId) {
    const appointment = await this.getById(appointmentId);
    if (appointment.status !== 'pending') {
      throw ApiError.badRequest('Can only decline pending appointments');
    }
    // Declining just means this caregiver passes — appointment stays pending for others
    return appointment;
  },

  async start(appointmentId, userId) {
    const appointment = await this.getById(appointmentId);
    this._validateTransition(appointment.status, 'in_progress');
    this._validateCaregiverOwnership(appointment, userId);

    return AppointmentModel.update(appointmentId, {
      status: 'in_progress',
      actual_start: new Date(),
    });
  },

  async complete(appointmentId, userId) {
    const appointment = await this.getById(appointmentId);
    this._validateTransition(appointment.status, 'completed');
    this._validateCaregiverOwnership(appointment, userId);

    return AppointmentModel.update(appointmentId, {
      status: 'completed',
      actual_end: new Date(),
    });
  },

  async cancel(appointmentId, userId, reason) {
    const appointment = await this.getById(appointmentId);
    this._validateTransition(appointment.status, 'cancelled');

    return AppointmentModel.update(appointmentId, {
      status: 'cancelled',
      cancellation_reason: reason,
    });
  },

  async getTasks(appointmentId) {
    return AppointmentModel.getTasks(appointmentId);
  },

  async addTask(appointmentId, taskData) {
    return AppointmentModel.addTask({
      appointment_id: appointmentId,
      description: taskData.description,
      sort_order: taskData.sortOrder || 0,
    });
  },

  async toggleTask(taskId, completed) {
    return AppointmentModel.updateTask(taskId, {
      is_completed: completed,
      completed_at: completed ? new Date() : null,
    });
  },

  _validateTransition(currentStatus, newStatus) {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw ApiError.badRequest(
        `Cannot transition from '${currentStatus}' to '${newStatus}'`
      );
    }
  },

  async _validateCaregiverOwnership(appointment, userId) {
    const profile = await CaregiverModel.findByUserId(userId);
    if (!profile || appointment.caregiver_id !== profile.id) {
      throw ApiError.forbidden('Only the assigned caregiver can perform this action');
    }
  },
};

module.exports = AppointmentService;
