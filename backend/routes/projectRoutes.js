const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

router.route("/")
  .post(protect, createProject)   // Create
  .get(protect, getProjects);     // List all projects of user

router.route("/:id")
  .get(protect, getProjectById)   // Fetch single project
  .put(protect, updateProject)    // Update
  .delete(protect, deleteProject) // Delete

module.exports = router;
