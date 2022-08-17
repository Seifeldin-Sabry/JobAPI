const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new AppError("Invalid Authentication", StatusCodes.UNAUTHORIZED);

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (e) {
    throw new AppError("Invalid Authentication", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = auth;
