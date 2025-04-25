const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: 1000,
    },

    // Reference to the post the comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    // Reference to the user who wrote the comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // For nested replies (self-reference)
    originalCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    // Users who liked the comment
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Soft delete support
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search on comment content
CommentSchema.index({ content: "text" });

// Pre hook to cascade soft delete to child replies
CommentSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

CommentSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Comment", CommentSchema);
