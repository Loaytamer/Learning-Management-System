const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// Use environment variable for JWT secret (no hardcoded fallback)
const JWT_SECRET = "your-secret-key";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Create new user with default role if not provided
    const user = await User.create({
      username,
      email,
      password,
      role: role || "student",
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("GetCurrentUser - User from DB with avatar:", user.avatar); // Debug log

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
        enrolledCourses: user.enrolledCourses || [],
        createdCourses: user.createdCourses || [],
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload profile image
exports.uploadavatar = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    const imageUrl = req.file.path;

    // Update user profile image
    const user = await User.findByIdAndUpdate(userId, { avatar: imageUrl });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};


exports.deleteavatarController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || !user.avatar) {
      return res.status(404).json({ message: "User or image not found" });
    }

    const imageUrl = user.avatar;


    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1]; // abc123.jpg
    const folder = parts[parts.length - 2]; // user_profiles

    const public_id = `${folder}/${fileName.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res
        .status(400)
        .json({ message: "Failed to delete image", result });
    }


    user.avatar = undefined;
    await user.save();

    res.status(200).json({
      message: "Image deleted successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};