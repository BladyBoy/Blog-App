const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return errorResponse(res, "Username or Email is already in use. Please try another.", 400);
    }

    // Create and save the new user
    const newUser = new User({ username, email, password, firstName, lastName });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return user data along with token
    const userData = {
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    return successResponse(res, "Registration successful! Welcome aboard.", { token, user: userData }, 201);
  } catch (err) {
    next(err); // Centralized error handling
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

    // Check if user exists and password is valid
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Invalid credentials. Please check your login details.", 400);
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return user data along with token
    const userData = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return successResponse(res, "Login successful. Welcome back!", { token, user: userData });
  } catch (err) {
    next(err); // Centralized error handling
  }
};

// Fetch user profile
exports.profile = async (req, res, next) => {
  try {
    const user = req.user; // Comes from the `protect` middleware

    // If user doesn't exist
    if (!user) {
      return errorResponse(res, "User not found. Please log in again.", 404);
    }

    return successResponse(res, "Profile fetched successfully.", user);
  } catch (err) {
    next(err); // Centralized error handling
  }
};
