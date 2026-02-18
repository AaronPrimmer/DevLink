const router = require("express").Router();
const postRoutes = require("./postRoutes");
const developerRoutes = require("./developerRoutes");

router.use("/posts", postRoutes);
router.use("/developers", developerRoutes);

module.exports = router;
