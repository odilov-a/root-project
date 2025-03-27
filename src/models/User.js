const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const User = model("User", userSchema);
module.exports = User;
