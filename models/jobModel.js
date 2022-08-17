const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "You must provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "You must provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
