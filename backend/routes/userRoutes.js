const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const { body } = require("express-validator");
const { protect } = require('../middleware/authMiddleware');

router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
], registerUser);

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
],loginUser)

router.get("/profile",protect,getProfile);

module.exports = router;