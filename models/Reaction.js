const { Schema, Types, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reaction: { type: Boolean, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true,
    id: false,
  },
);

module.exports = model("Reaction", reactionSchema);
