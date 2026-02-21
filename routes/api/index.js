const router = require("express").Router();
const postRoutes = require("./postRoutes");
const developerRoutes = require("./developerRoutes");
const reactionRoutes = require("./reactionRoutes");

// Add prefix of `/api` to all routes defined in this file.

router.use("/posts", postRoutes);
router.use("/developers", developerRoutes);
router.use("/reactions", reactionRoutes);

module.exports = router;
