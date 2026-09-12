const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    clientId: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    selection: { type: String, default: "" },
    resolved: { type: Boolean, default: false },
    position: {
      top: { type: Number, default: 0 },
      left: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
