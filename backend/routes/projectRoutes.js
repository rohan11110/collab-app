const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/projectController");

router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router.get("/:id/members", protect, getMembers);
router.post("/:id/invite", protect, inviteMember);
router.delete("/:id/members/:userId", protect, removeMember);
router.get("/:id/versions", protect, getVersions);
router.post("/:id/versions/:versionId/restore", protect, restoreVersion);

router.route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
