const express = require("express");
const {
  createComment,
  getMyComments,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  toggleLikeComment,
} = require("../controllers/commentController");
const protect = require("../middlewares/auth");

const router = express.Router();

// POST a new comment or reply
router.post("/", protect, createComment);

// GET all comments for a post (optionally paginated and nested)
router.get("/", getCommentsByPostId);

// GET all comments by logged-in user
router.get("/my-comments", protect, getMyComments);

// GET a single comment by ID
router.get("/:id", getCommentById);

// PUT update a comment
router.put("/:id", protect, updateComment);

// DELETE a comment (and its replies)
router.delete("/:id", protect, deleteComment);

// PATCH like/unlike a comment
router.patch("/:id/like", protect, toggleLikeComment);

module.exports = router;
