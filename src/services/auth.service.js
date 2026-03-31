const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const CaregiverModel = require('../models/caregiver.model');
const CareReceiverModel = require('../models/careReceiver.model');
const ApiError = require('../utils/ApiError');

const BCRYPT_ROUNDS = 12;

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
}

const AuthService = {
  async register({ email, password, firstName, lastName, phone, role }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await UserModel.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
    });

    // Create role-specific profile
    if (role === 'caregiver') {
      await CaregiverModel.create({ user_id: user.id });
    } else if (role === 'care_receiver') {
      await CareReceiverModel.create({ user_id: user.id });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role },
      accessToken,
      refreshToken,
    };
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.is_active) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role },
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'refresh') {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const user = await UserModel.findById(decoded.sub);
      if (!user || !user.is_active) {
        throw ApiError.unauthorized('User not found or inactive');
      }

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unauthorized('Invalid refresh token');
    }
  },

  async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const { password_hash, ...safeUser } = user;
    return safeUser;
  },
};

module.exports = AuthService;
