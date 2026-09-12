const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    content: { type: String, default: "" },
    title: { type: String, default: "Untitled Document" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, default: "Autosave" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocumentVersion", versionSchema);
