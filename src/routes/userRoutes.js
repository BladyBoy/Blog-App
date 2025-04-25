const express = require("express");
const router = express.Router();
const { register, login, profile } = require("../controllers/userController");
const protect = require("../middlewares/auth");

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

router.get("/profile", protect, profile);

module.exports = router;
