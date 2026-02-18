const { Schema, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxlength: 280 },
    username: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  },
  {
    timestamps: true,
    id: false,
  },
);

module.exports = reactionSchema;
