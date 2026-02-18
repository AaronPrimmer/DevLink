const Developer = require("../models/Developer");

module.exports = {
  // Get all developers
  async getAllDevelopers(req, res) {
    try {
      const developers = await Developer.find().select("-__v");
      res.json(developers);
    } catch (err) {
      res
        .satus(500)
        .json({
          error: "Failed to retrieve developers",
          errorMessage: err.message,
        });
    }
  },

  // Get a single developer by ID
  async getDeveloperById(req, res) {
    try {
      const developer = await Developer.findById(req.params.id).select("-__v");
      if (!developer) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json(developer);
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to retrieve developer",
          errorMessage: err.message,
        });
    }
  },

  // Create a new developer
  async createDeveloper(req, res) {
    try {
      const createdDeveloper = await Developer.create(req.body);
      res.status(201).json(createdDeveloper);
    } catch (err) {
      res
        .status(400)
        .json({
          error: "Failed to create developer",
          errorMessage: err.message,
        });
    }
  },

  // Update a developer by ID
  async updateDeveloper(req, res) {
    try {
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      ).select("-__v");
      if (!updatedDeveloper) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json(updatedDeveloper);
    } catch (err) {
      res
        .satus(500)
        .json({
          error: "Failed to update developer",
          errorMessage: err.message,
        });
    }
  },

  // Delete a developer by ID
  async deleteDeveloper(req, res) {
    try {
      const deletedDeveloper = await Developer.deleteOne({
        _id: req.params.id,
      });
      if (deletedDeveloper.deletedCount === 0) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json({ message: "Developer deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to delete developer",
          errorMessage: err.message,
        });
    }
  },
};
