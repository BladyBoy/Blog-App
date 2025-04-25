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

// new comment or reply
router.post("/", protect, createComment);

// fetching all comments for a post
router.get("/", getCommentsByPostId);

// fetching all comments by logged-in user
router.get("/my-comments", protect, getMyComments);

// fetching a single comment by ID
router.get("/:id", getCommentById);

// updating a comment
router.put("/:id", protect, updateComment);

// DELETE a comment (and its replies)
router.delete("/:id", protect, deleteComment);

// PATCH like/unlike a comment
router.patch("/:id/like", protect, toggleLikeComment);

module.exports = router;
