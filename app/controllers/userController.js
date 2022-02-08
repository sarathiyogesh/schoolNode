const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    users
  });
});

exports.addUser = catchAsync(async (req, res, next) => {
  console.log(req.body.name);
  const name = req.body.name;
  const email = req.body.email;
  const users = await User.create({"name": name, "email": email});

  res.status(200).json({
    status: 'success',
    data: users
  });
});
