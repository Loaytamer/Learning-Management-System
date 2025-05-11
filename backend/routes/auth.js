const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  uploadProfileImage,
  deleteProfileImageController,
} = require("../controllers/authController");
const auth = require('../middleware/auth');
const upload  = require("../utils/cloudinaryUploader");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

// @route   POST /api/auth/upload
// @desc    Upload profile image
// @access  Private

router.post('/upload', auth, upload.single('image'), uploadProfileImage);

// @route   DELETE /api/auth/delete-image
// @desc    Delete profile image
// @access  Private
router.delete("/delete-image", auth, deleteProfileImageController);



module.exports = router;