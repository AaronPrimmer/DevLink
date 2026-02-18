const { Schema, model } = require("mongoose");

const developerSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
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
