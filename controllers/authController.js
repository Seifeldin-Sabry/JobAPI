const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");

exports.register = async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Signup successful",
    token: user.createJWT(),
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      "Please Provide Email and Password",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user)
    throw new AppError("Invalid Credentials", StatusCodes.UNAUTHORIZED);

  const isPasswordCorrect = await user.correctPassword(password);

  if (!isPasswordCorrect)
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    status: "success",
    user: {
      name: user.name,
    },
    token,
  });
};
