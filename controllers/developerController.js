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
      const developer = await Developer.findById(req.params.id)
        .populate("connections.connectionId", "firstname lastname email")
        .select("-__v -password -birthdate");
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
      res.status(201).json({ success: true, user: createdDeveloper.fullName });
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
      ).select("-__v -password -birthdate");
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
      const connectionSearch = await Developer.findOne({
        _id: developerId,
        "connections.connectionId": { $in: [connectionId] },
      }).limit(1);

      if (connectionSearch) {
        return res
          .status(200)
          .json({ success: false, error: "Connection already exists" });
      }

      const connection = await Developer.findByIdAndUpdate(
        developerId,
        {
          $addToSet: {
            connections: { connectionId: connectionId },
          },
        },
        { returnDocument: "after" },
      ).select("-__v -password -birthdate");
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
  async updateConnection(req, res) {
    try {
      const { developerId, connectionId } = req.params;
      const { status } = req.body;
      const updatedConnection = await Developer.findOne({
        _id: developerId,
        "connections.connectionId": { $in: [connectionId] },
      }).limit(1);
      if (!updatedConnection) {
        return res
          .status(404)
          .json({ success: false, error: "Connection not found" });
      }
      const connectionIndex = updatedConnection.connections.findIndex(
        (conn) => conn.connectionId.toString() === connectionId,
      );
      if (connectionIndex === -1) {
        return res
          .status(404)
          .json({ success: false, error: "Connection not found" });
      }
      updatedConnection.connections[connectionIndex].status = status;
      await updatedConnection.save();
      res.json({ success: true, updatedConnection });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to update connection",
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
