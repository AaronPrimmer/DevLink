const router = require("express").Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);

// GET all posts for a specific developer
// /api/posts/:id
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;
