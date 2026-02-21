const router = require("express").Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createReaction,
  getReactionById,
  deleteReaction,
  updateReaction,
} = require("../../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);

// GET all posts for a specific developer
// /api/posts/:id
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

// POST a new reaction
router.route("/:id/reactions").post(createReaction);

// GET, PUT, DELETE a reaction by ID
router
  .route("/:id/reactions/:reactionId")
  .get(getReactionById)
  .put(updateReaction)
  .delete(deleteReaction);

module.exports = router;
