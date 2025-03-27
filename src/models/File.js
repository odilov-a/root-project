const { Schema, Types, model } = require("mongoose");
const fileSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "signed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const File = model("File", fileSchema);
module.exports = File;
