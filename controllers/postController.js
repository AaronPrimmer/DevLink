const Post = require("../models/Post");

module.exports = {
  // Placeholder functions for post controller methods
  // Get all posts
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find().select("-__v");
      res.json(posts);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve posts", errorMessage: err.message });
    }
  },

  // Get a single post by ID
  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "firstname lastname")
        .select("-__v");
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve post", errorMessage: err.message });
    }
  },

  // Create a new post
  async createPost(req, res) {
    try {
      const createdPost = await Post.create(req.body);
      res.status(201).json(createdPost);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Failed to create post", errorMessage: err.message });
    }
  },

  // Update a post by ID
  async updatePost(req, res) {
    try {
      const updatedPost = await Post.updateOne(
        { postId: req.params.id },
        { $set: req.body },
        { runValidators: true },
      );
      if (updatedPost.matchedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ message: "Post updated successfully" });
    } catch (err) {
      res
        .status(400)
        .json({ error: "Failed to update post", errorMessage: err.message });
    }
  },

  // Delete a post by ID
  async deletePost(req, res) {
    try {
      const deletedPost = await Post.deleteOne({ postId: req.params.id });
      if (deletedPost.deletedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to delete post", errorMessage: err.message });
    }
  },
};
