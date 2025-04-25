const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { successResponse } = require("../middlewares/responseHandler");

// Creating a new comment or reply for the post
exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, originalCommentId } = req.body;

    if (!content) {
      return next(new Error("Comment content is required."));
    }
    if (!postId) {
      return next(new Error("Post ID is required."));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new Error("Post not found"));
    }

    if (originalCommentId) {
      const parent = await Comment.findById(originalCommentId);
      if (!parent) {
        return next(new Error("Parent comment not found"));
      }
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      originalCommentId: originalCommentId || null,
    });

    return successResponse(res, "Comment added successfully", comment, 201);
  } catch (error) {
    console.error("Error creating comment:", error);
    return next(new Error("Server error"));
  }
};

// Displaying all comments for a post (with pagination + nested replies if there)
exports.getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId, page = 1, limit = 10, nested = "true" } = req.query;

    if (!postId) {
      return next(new Error("Post ID is required"));
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find({ post: postId, originalCommentId: null })
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalComments = await Comment.countDocuments({
      post: postId,
      originalCommentId: null,
    });

    if (totalComments === 0) {
      return successResponse(res, "No comments yet for this post", {
        total: totalComments,
        page: parseInt(page),
        limit: parseInt(limit),
        comments: [],
      });
    }

    if (nested === "true") {
      const commentIds = comments.map((c) => c._id);
      const replies = await Comment.find({ originalCommentId: { $in: commentIds } })
        .populate("author", "username email")
        .sort({ createdAt: 1 });

      const repliesByParent = {};
      replies.forEach((reply) => {
        const parentId = reply.originalCommentId.toString();
        if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
        repliesByParent[parentId].push(reply);
      });

      comments.forEach((comment) => {
        comment._doc.total_replies = (repliesByParent[comment._id.toString()] || []).length;
        comment._doc.replies = repliesByParent[comment._id.toString()] || [];
      });
    }

    return successResponse(res, "Comments fetched successfully", {
      total: totalComments,
      page: parseInt(page),
      limit: parseInt(limit),
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return next(new Error("Server error"));
  }
};

// displaying a single comment by ID
exports.getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id)
      .populate("author", "username email");

    if (!comment) {
      return next(new Error("Comment not found"));
    }

    const replies = await Comment.find({ originalCommentId: comment._id })
      .populate("author", "username email")
      .sort({ createdAt: 1 });

    comment._doc.total_replies = replies.length;
    comment._doc.replies = replies.length > 0 ? replies : [];

    if (replies.length === 0) {
      comment._doc.repliesMessage = "No replies yet for this comment. Be the one to comment this post";
    }

    return successResponse(res, "Comments retrieved", comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return next(new Error("Server error"));
  }
};

// displaying all comments made by the logged-in user
exports.getMyComments = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next(new Error("User not authenticated"));
    }

    const userId = req.user._id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ author: userId, originalCommentId: null })
      .populate({
        path: "post",
        select: "title",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ author: userId, originalCommentId: null });

    if (total === 0) {
      return successResponse(res, "You have not made any comments yet", {
        total,
        page,
        limit,
        comments: [],
      });
    }

    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({ originalCommentId: { $in: commentIds } })
      .populate("author", "username email")
      .sort({ createdAt: 1 });

    const repliesByParent = {};
    replies.forEach((reply) => {
      const parentId = reply.originalCommentId.toString();
      if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
      repliesByParent[parentId].push(reply);
    });

    comments.forEach((comment) => {
      comment._doc.total_replies = (repliesByParent[comment._id.toString()] || []).length;
      comment._doc.replies = repliesByParent[comment._id.toString()] || [];
    });

    return successResponse(res, "User comments fetched successfully", {
      total,
      page,
      limit,
      comments,
    });

  } catch (error) {
    console.error("Error fetching user comments:", error);
    return next(new Error("Server error"));
  }
};

// Update a comment
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return next(new Error("Comment not found", 404));
    if (comment.author.toString() !== req.user._id.toString())
      return next(new Error("Unauthorized", 403));

    comment.content = content || comment.content;
    await comment.save();

    return successResponse(res, "Comment updated", comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return next(new Error("Server error", 500));
  }
};

// Delete a comment and its replies
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return next(new Error("Comment not found", 404));
    if (comment.author.toString() !== req.user._id.toString())
      return next(new Error("Unauthorized", 403));

    // Delete replies first
    await Comment.deleteMany({ parentComment: id });

    // Delete comment
    await comment.deleteOne();

    return successResponse(res, "Comment deleted");
  } catch (error) {
    console.error("Error deleting comment:", error);
    return next(new Error("Server error", 500));
  }
};

// Like / Unlike a comment
exports.toggleLikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return next(new Error("Comment not found", 404));

    const userId = req.user._id.toString();
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return successResponse(res, alreadyLiked ? "Comment unliked" : "Comment liked", {
      likeCount: comment.likes.length,
      likedByUser: !alreadyLiked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return next(new Error("Server error", 500));
  }
};
