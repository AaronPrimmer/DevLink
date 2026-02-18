const router = require("express").Router();
// Import Developer model
const {
  getAllDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
} = require("../../controllers/developerController");

// GET all developers
// /api/developers/
router.route("/").get(getAllDevelopers).post(createDeveloper);

// GET a single developer by ID
// /api/developers/:id
router
  .route("/:id")
  .get(getDeveloperById)
  .put(updateDeveloper)
  .delete(deleteDeveloper);

module.exports = router;
