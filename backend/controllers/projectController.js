const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");

// @desc Create new project
const createProject = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const project = await Project.create({
    title,
    content,
    owner: req.user._id,
    members: [req.user._id],
  });

  res.status(201).json(project);
});

// @desc Get all projects for logged-in user
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    members: req.user._id,
  }).populate("owner", "name email");

  if (!projects || projects.length === 0) {
    return res.status(200).json({ projects: [] });
  }

  res.json(projects);
});

// @desc Get single project
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner", "name email");
  if (!project.members.includes(req.user._id)) {
  return res.status(403).json({ message: "Access denied" });
}

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

// @desc Update project
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  project.title = req.body.title || project.title;
  project.content = req.body.content || project.content;
  const updatedProject = await project.save();

  res.json(updatedProject);
});

// @desc Delete project
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
