const express = require("express");
const { createPost,
    getAllPosts,
    getPostBySlug,
    updatePost,
    deletePost,
    toggleLike,
    searchPosts } = require("../controllers/postController"); 
const protect = require("../middlewares/auth");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/:slug", getPostBySlug);
router.put("/:slug", protect, updatePost);
router.delete("/:slug", protect, deletePost);
router.patch("/:slug/like", protect, toggleLike);


module.exports = router;
