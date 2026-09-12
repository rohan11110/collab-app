const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const DocumentVersion = require("../models/versionModel");

const isMember = (project, userId) =>
  project.members.some((member) => member.toString() === userId.toString());

const createProject = asyncHandler(async (req, res) => {
  const { title, content = "" } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const project = await Project.create({
    title: title.trim(),
    content,
    owner: req.user._id,
    members: [req.user._id],
  });

  res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ updatedAt: -1 });

  res.json({ projects });
});

const getProjectById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid document id" });
  }

  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email")
    .populate("comments.user", "name email")
    .populate("messages.user", "name email");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isMember(project, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid document id" });
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isMember(project, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (req.body.title !== undefined) {
    project.title = String(req.body.title).trim() || project.title;
  }

  if (req.body.content !== undefined) {
    project.content = String(req.body.content);
  }

  await project.save();

  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can delete this document" });
  }

  await project.deleteOne();
  await DocumentVersion.deleteMany({ project: project._id });

  res.json({ message: "Project deleted" });
});

const getMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("members", "name email");

  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!isMember(project, req.user._id)) return res.status(403).json({ message: "Access denied" });

  res.json({
    owner: project.owner,
    members: project.members,
  });
});

const inviteMember = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const project = await Project.findById(req.params.id);

  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can invite users" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No registered user found with this email" });
  }

  if (project.members.some((member) => member.toString() === user._id.toString())) {
    return res.status(409).json({ message: "User is already a member" });
  }

  project.members.push(user._id);
  await project.save();

  const populated = await Project.findById(project._id)
    .populate("owner", "name email")
    .populate("members", "name email");

  const io = req.app.get("io");
  io?.to(`project:${project._id}`).emit("member:added", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "editor",
    },
    projectId: project._id.toString(),
  });

  res.status(201).json({
    message: `${user.name} has been added to the document`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "editor",
    },
    members: populated.members,
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can remove users" });
  }

  if (project.owner.toString() === req.params.userId) {
    return res.status(400).json({ message: "Owner cannot be removed" });
  }

  project.members = project.members.filter(
    (member) => member.toString() !== req.params.userId
  );

  await project.save();

  req.app.get("io")?.to(`project:${project._id}`).emit("member:removed", {
    userId: req.params.userId,
    projectId: project._id.toString(),
  });

  res.json({ members: project.members });
});

const getVersions = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!isMember(project, req.user._id)) return res.status(403).json({ message: "Access denied" });

  const versions = await DocumentVersion.find({ project: project._id })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ versions });
});

const restoreVersion = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (!isMember(project, req.user._id)) return res.status(403).json({ message: "Access denied" });

  const version = await DocumentVersion.findOne({
    _id: req.params.versionId,
    project: project._id,
  });

  if (!version) return res.status(404).json({ message: "Version not found" });

  project.content = version.content;
  await project.save();

  const restoredVersion = await DocumentVersion.create({
    project: project._id,
    content: project.content,
    title: project.title,
    createdBy: req.user._id,
    reason: "Restored version",
  });

  res.json({ project, version: restoredVersion });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMembers,
  inviteMember,
  removeMember,
  getVersions,
  restoreVersion,
};
