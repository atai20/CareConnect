const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({ status: 201, message: 'Account created', ...result });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  res.json({ status: 200, message: 'Login successful', ...result });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthService.refreshToken(req.body.refreshToken);
  res.json({ status: 200, ...result });
});

const logout = catchAsync(async (req, res) => {
  // In production, blacklist the refresh token here
  res.status(204).send();
});

const getMe = catchAsync(async (req, res) => {
  const user = await AuthService.getProfile(req.user.id);
  res.json({ status: 200, data: user });
});

module.exports = { register, login, refreshToken, logout, getMe };
