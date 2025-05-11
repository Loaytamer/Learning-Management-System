const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, uploadProfileImage } = require('../controllers/authController');
const auth = require('../middleware/auth');
import { upload } from '../utils/cloudinaryUploader';

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

router.post('/upload-image', auth, upload.single('image'), uploadProfileImage);

module.exports = router;