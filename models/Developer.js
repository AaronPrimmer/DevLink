const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR = 10;

const developerSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    github: { type: String },
    linkedin: { type: String },
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

module.exports = model("Developer", developerSchema);
