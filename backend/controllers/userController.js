const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (id) =>
  jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      type: "validation_error",
      message: "Invalid input fields",
      errors: errors.array(),
    });
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      type: "duplicate_user",
      message: "User with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      type: "validation_error",
      message: "Invalid input fields",
      errors: errors.array(),
    });
  }

  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      type: "invalid_credentials",
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      type: "invalid_credentials",
      message: "Invalid email or password",
    });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

const getProfile = asyncHandler(async (req, res) => {
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = { registerUser, loginUser, getProfile };
