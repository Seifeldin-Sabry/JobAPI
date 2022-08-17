const Job = require("../models/jobModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");

exports.createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.OK).json({
    status: "success",
    data: { job },
  });
};

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: jobs,
  });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({
    status: "success",
    data: { job },
  });
};
exports.updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new AppError(`No job with id ${jobId}`, 404);
  }
  res.status(StatusCodes.OK).json({ job });
};
exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    status: "success",
  });
};
