const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
    minlength: [2, "Name can not be less than 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: [true, "Email already taken"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password can not be less than 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirmation is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and password confirmation do not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Function to hash the password before saving it to the database
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // method for checking if password was changed after last login
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.method("createJWT", function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
});

const User = mongoose.model("User", userSchema);

module.exports = User;
