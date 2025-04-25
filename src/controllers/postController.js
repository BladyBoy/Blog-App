const Post = require("../models/Post");
const slugify = require("slugify");
const { successResponse } = require("../middlewares/responseHandler");

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    // Check for missing title or content
    if (!title || !content) {
      const error = new Error("Title and content are required.");
      error.statusCode = 400;
      throw error;
    }

    // Generate slug for title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if the post already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      const error = new Error("A post with the same title already exists.");
      error.statusCode = 409;
      throw error;
    }

    // Create the post
    const post = await Post.create({
      title,
      content,
      tags,
      slug,
      author: req.user._id, // Author from logged-in user
    });

    return successResponse(res, "Post created successfully", post, 201);
  } catch (error) {
    next(error); // Handle errors centrally
  }
};

// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return successResponse(res, "Posts fetched successfully", posts);
  } catch (error) {
    next(error);
  }
};

// Get a post by its slug
exports.getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug }).populate("author", "username email");

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    // Increment view count
    post.views++;
    await post.save();

    return successResponse(res, "Post retrieved", post);
  } catch (error) {
    next(error);
  }
};

// Update a post
exports.updatePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    // Only the author can update their own post
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    const { title, content, tags } = req.body;

    // If title is updated, check for duplicate slug
    if (title) {
      const newSlug = slugify(title, { lower: true, strict: true });

      if (newSlug !== post.slug) {
        const existingPost = await Post.findOne({ slug: newSlug });
        if (existingPost && existingPost._id.toString() !== post._id.toString()) {
          const error = new Error("A post with the new title already exists.");
          error.statusCode = 409;
          throw error;
        }
        post.slug = newSlug;
      }

      post.title = title;
    }

    if (content) post.content = content;
    if (tags) post.tags = tags;

    await post.save();
    return successResponse(res, "Post updated", post);
  } catch (error) {
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    // Only the author can delete their post
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    await post.deleteOne();
    return successResponse(res, "Post deleted");
  } catch (error) {
    next(error);
  }
};

// Like or unlike a post
exports.toggleLike = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Update like count
    const likeCount = post.likes.length;
    const likedByUser = post.likes.some(id => id.toString() === userId);

    return successResponse(res, alreadyLiked ? "Post unliked" : "Post liked", {
      post,
      likeCount,
      likedByUser,
    });
  } catch (error) {
    next(error);
  }
};

// Search Functionality
exports.searchPosts = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10 } = req.query;

    // Validate search query
    if (!query || query.trim() === "") {
      const error = new Error("Search query is required.");
      error.statusCode = 400;
      throw error;
    }

    // Validate pagination
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (page < 1 || limit < 1) {
      const error = new Error("Page and limit must be positive numbers.");
      error.statusCode = 400;
      throw error;
    }

    // ✅ Log inputs
    console.log("Search Query:", query);
    console.log("Page:", page);
    console.log("Limit:", limit);

    // Perform text search in title and content
    const searchResults = await Post.find(
      { $text: { $search: query } }
    )
      .populate("author", "username email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // ✅ Log search output
    console.log("Search Results Length:", searchResults.length);
    console.log("Search Results:", searchResults);

    // Get total number of posts matching the search query
    const totalPosts = await Post.countDocuments({ $text: { $search: query } });

    // ✅ Log total posts count
    console.log("Total Matching Posts:", totalPosts);

    return successResponse(res, "Search results fetched successfully", {
      posts: searchResults,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in searchPosts:", error);
    next(error);
  }
};
