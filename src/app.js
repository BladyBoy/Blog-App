const express = require("express");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Middlewares
const errorHandler = require("./middlewares/errorHandler");
const { errorResponse } = require("./middlewares/responseHandler");

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // To enable CORS (Cross-Origin Resource Sharing)

// Routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/posts", postRoutes); // Post-related routes
app.use("/api/comments", commentRoutes); // Comment-relatd routes

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Blog API is running!" });
});

// Catch-all route for undefined paths (404)
app.use((req, res) => {
  return errorResponse(res, "Route not found", 404);
});

// Error handling middleware
app.use(errorHandler); // Centralized error handler

module.exports = app;
