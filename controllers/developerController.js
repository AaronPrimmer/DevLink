const Developer = require("../models/Developer");

module.exports = {
  // Get all developers
  async getAllDevelopers(req, res) {
    try {
      const developers = await Developer.find().select(
        "-__v -password -birthdate",
      );
      res.json({ success: true, developers });
    } catch (err) {
      res.satus(500).json({
        success: false,
        error: "Failed to retrieve developers",
        errorMessage: err.message,
      });
    }
  },

  // Get a single developer by ID
  async getDeveloperById(req, res) {
    try {
      const developer = await Developer.findById(req.params.id).select(
        "-__v -password -birthdate",
      );
      if (!developer) {
        return res
          .status(404)
          .json({ success: false, error: "Developer not found" });
      }
      res.json({ success: true, developer });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve developer",
        errorMessage: err.message,
      });
    }
  },

  // Create a new developer
  async createDeveloper(req, res) {
    try {
      const createdDeveloper = await Developer.create(req.body);
      res.status(201).json({ success: true, createdDeveloper });
    } catch (err) {
      res.status(400).json({
        success: false,
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
        return res
          .status(404)
          .json({ success: false, error: "Developer not found" });
      }
      res.json({ success: true, updatedDeveloper });
    } catch (err) {
      res.satus(500).json({
        success: false,
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
        return res
          .status(404)
          .json({ success: false, error: "Developer not found" });
      }
      res.json({ success: true, message: "Developer deleted successfully" });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to delete developer",
        errorMessage: err.message,
      });
    }
  },
  async addConnection(req, res) {
    try {
      const { developerId, connectionId } = req.params;
      // const developer = await Developer.findById(developerId);
      // if (!developer) {
      //   return res.status(404).json({ error: "Developer not found" });
      // }
      const connection = await Developer.findByIdAndUpdate(
        developerId,
        {
          $addToSet: {
            connections: { connectionId: connectionId, status: "pending" },
          },
        },
        { returnDocument: "after" },
      );
      if (!connection) {
        return res
          .status(404)
          .json({ success: false, error: "Connection not found" });
      }
      res.json({ success: true, connection });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to add connection",
        errorMessage: err.message,
      });
    }
  },
  async deleteConnection(req, res) {
    try {
      const { developerId, connectionId } = req.params;
      const deletedConnection = await Developer.findByIdAndUpdate(
        developerId,
        { $pull: { connections: { connectionId: connectionId } } },
        { returnDocument: "after" },
      );
      if (!deletedConnection) {
        return res
          .status(404)
          .json({ success: false, error: "Connection not found" });
      }
      res.json({ success: true, deletedConnection });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to delete connection",
        errorMessage: err.message,
      });
    }
  },
};
