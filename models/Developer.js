const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR = 10;

const connectionSchema = new Schema({
  connectionId: { type: Schema.Types.ObjectId, ref: "Developer" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const developerSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    github: { type: String },
    linkedIn: { type: String },
    connections: [{ type: connectionSchema }],
    skills: [{ type: String }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

developerSchema.pre("save", async function () {
  const developer = this;

  if (!developer.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);

    developer.password = await bcrypt.hash(developer.password, salt);
  } catch (err) {
    return;
  }
});

developerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

developerSchema
  .virtual("fullName")
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  })
  .set(function (name) {
    const [first, last] = name.split(" ");
    this.set({ firstname: first, lastname: last });
  });

developerSchema.virtual("connectionCount").get(function () {
  if (!this.connections) {
    return 0;
  } else {
    return this.connections.length;
  }
});

developerSchema.virtual("postCount", {}).get(function () {
  if (!this.posts) {
    return 0;
  } else {
    return this.posts.length;
  }
});

module.exports = model("Developer", developerSchema);
