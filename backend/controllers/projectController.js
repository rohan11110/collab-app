const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");

const isMember = (project, userId) =>
  project.members.some((memberId) => memberId.toString() === userId.toString());

const createProject = asyncHandler(async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content : "";

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const project = await Project.create({
    title,
    content,
    owner: req.user._id,
    members: [req.user._id],
  });

  return res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ updatedAt: -1 });

  return res.json({ projects });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isMember(project, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  return res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isMember(project, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can update project metadata" });
  }

  if (req.body.title !== undefined) {
    const title = String(req.body.title).trim();
    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    project.title = title;
  }

  if (req.body.content !== undefined) {
    if (typeof req.body.content !== "string") {
      return res.status(400).json({ message: "Content must be a string" });
    }
    project.content = req.body.content;
  }

  return res.json(await project.save());
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await project.deleteOne();
  return res.json({ message: "Project deleted" });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
