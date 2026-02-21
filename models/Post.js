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
    reactions: {
      like: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    id: false,
  },
);

postSchema.virtual("likesCount").get(function () {
  return this.reactions.like || 0;
});

postSchema.virtual("dislikesCount").get(function () {
  return this.reactions.dislike || 0;
});

module.exports = model("Post", postSchema);
