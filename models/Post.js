const { Schema, Types, model } = require("mongoose");

const postSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  },
  {
    timestamps: true,
    id: false,
  },
);

module.exports = model("Post", postSchema);
