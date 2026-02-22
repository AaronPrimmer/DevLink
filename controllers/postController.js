const Post = require("../models/Post");
const Developer = require("../models/Developer");
const Reaction = require("../models/Reaction");

module.exports = {
  // Placeholder functions for post controller methods
  // Get all posts
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find().select("-__v");
      res.json({ success: true, posts });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve posts",
        errorMessage: err.message,
      });
    }
  },

  // Get a single post by ID
  async getPostById(req, res) {
    try {
      const post = await Post.findOne({ postId: req.params.id }).populate(
        "author",
        "firstname lastname",
      );
      if (!post) {
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve post",
        errorMessage: err.message,
      });
    }
  },

  // Create a new post
  async createPost(req, res) {
    try {
      const { title, content, author } = req.body;
      const createdPost = await Post.create({
        title,
        content,
        author,
        reactions: { like: 0, dislike: 0 },
      });
      const addPostToDeveloper = await Developer.findByIdAndUpdate(
        req.body.author,
        { $push: { posts: createdPost.postId } },
      );
      res.status(201).json({ success: true, createdPost });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: "Failed to create post",
        errorMessage: err.message,
      });
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
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, message: "Post updated successfully" });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: "Failed to update post",
        errorMessage: err.message,
      });
    }
  },

  // Delete a post by ID
  async deletePost(req, res) {
    try {
      const findAndDeleteAuthor = await Post.findOneAndDelete({
        postId: req.params.id,
      }).select("author");
      if (!findAndDeleteAuthor) {
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }
      if (findAndDeleteAuthor.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }
      const deletePostFromDeveloper = await Developer.findOneAndUpdate(
        { _id: findAndDeleteAuthor.author },
        { $pull: { posts: req.params.id } },
      );
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to delete post",
        errorMessage: err.message,
      });
    }
  },
  // Create a new reaction
  async createReaction(req, res) {
    try {
      const { reaction, userId, postId } = req.body;
      const findReaction = await Reaction.findOne({
        userId: userId,
        postId: postId,
      });
      if (findReaction) {
        return res.status(400).json({
          success: false,
          error: "User has already reacted to this post",
        });
      }
      const createdReaction = await Reaction.create(req.body);
      // Update the post's reactions count
      const updatePostReactions = await Post.findOneAndUpdate(
        { postId },
        {
          $inc: reaction ? { "reactions.like": 1 } : { "reactions.dislike": 1 },
        },
        { returnDocument: "after" },
      );
      res.status(201).json({ success: true, createdReaction });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: "Failed to create reaction",
        errorMessage: err.message,
      });
    }
  },

  // Delete a reaction by ID
  async deleteReaction(req, res) {
    try {
      const { id, reactionId } = req.params;
      const findReaction = await Reaction.findOne({
        reactionId: reactionId,
      }).select("userId reaction");
      if (!findReaction) {
        return res
          .status(404)
          .json({ success: false, error: "Reaction not found" });
      }
      const deleteReaction = await Reaction.deleteOne({
        reactionId: reactionId,
      });
      if (deleteReaction.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Reaction not Deleted" });
      }
      if (findReaction) {
        const updatePostReactions = await Post.findOneAndUpdate(
          { postId: id },
          {
            $inc: findReaction.reaction
              ? { "reactions.like": -1 }
              : { "reactions.dislike": -1 },
          },
        );
      }

      res.json({ success: true, message: "Reaction deleted successfully" });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to delete reaction",
        errorMessage: err.message,
      });
    }
  },

  // Update a reaction by ID
  async updateReaction(req, res) {
    try {
      const { id, reactionId } = req.params;
      const findReaction = await Reaction.findOne({
        reactionId: reactionId,
        postId: id,
      }).select("reaction userId");
      if (!findReaction) {
        return res.status(404).json({
          success: false,
          error: "Reaction not found",
        });
      }
      if (findReaction.reaction === req.body.reaction) {
        return res.status(400).json({
          success: false,
          error: "Reaction is the same as the current reaction",
        });
      }
      const updatedReaction = await Reaction.findOneAndUpdate(
        { reactionId: reactionId, postId: id, userId: findReaction.userId },
        { $set: { reaction: req.body.reaction } },
        { returnDocument: "after" },
      );
      if (!updatedReaction) {
        return res.status(404).json({
          success: false,
          error: "Failed to update reaction",
        });
      }
      const updatePostReactions = await Post.findOneAndUpdate(
        { postId: id },
        {
          $inc: updatedReaction.reaction
            ? { "reactions.like": 1, "reactions.dislike": -1 }
            : { "reactions.like": -1, "reactions.dislike": 1 },
        },
      );
      res.json({ success: true, updatedReaction });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: "Failed to update reaction",
        errorMessage: err.message,
      });
    }
  },
};
