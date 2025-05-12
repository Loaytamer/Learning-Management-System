const mongoose = require('mongoose');

const { Course } = require('../models/Course');
const User  = require('../models/User');

// Debug logging to confirm models are loaded
console.log('Course model loaded:', Course ? 'Yes' : 'No');
console.log('User model loaded:', User ? 'Yes' : 'No');

// Throw an error if models are not defined (this will crash the server at startup if there's an issue)
if (!Course) {
  throw new Error('Course model is not defined. Check the export in models/Course.js');
}
if (!User) {
  throw new Error('User model is not defined. Check the export in models/User.js');
}

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'username');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.user);
    const courseData = {
      ...req.body,
      instructor: userId, // Use req.user.id, ignore req.body.instructor
      instructorName: req.user.username, // Use req.user.username, ignore req.body.instructorName
      enrolledStudents: req.body.enrolledStudents || [], // Ensure default
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const course = new Course(courseData);
    await course.save();
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'username');
    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(true); // Frontend expects boolean
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json(true); // Frontend expects boolean
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    // Find the course
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled in the course
    if (course.enrolledStudents.includes(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Find the user
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the course is already in user's enrolledCourses (consistency check)
    if (user.enrolledCourses.includes(courseId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Course already in user\'s enrolled courses' });
    }

    // Update course: add user to enrolledStudents
    course.enrolledStudents.push(userId);
    await course.save({ session });

    // Update user: add course to enrolledCourses
    user.enrolledCourses.push(courseId);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return success response with updated user data
    res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
        enrolledCourses: user.enrolledCourses,
        createdCourses: user.createdCourses || [],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message,
    });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentIndex = course.enrolledStudents.indexOf(userId);
    if (studentIndex === -1) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    // Remove student from course
    course.enrolledStudents.splice(studentIndex, 1);
    await course.save();

    // Remove course from user's enrolled courses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== courseId);
    await user.save();

    res.json(true); // Frontend expects boolean
  } catch (error) {
    res.status(500).json({ message: 'Error unenrolling from course', error: error.message });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    course.lessons.push(req.body);
    await course.save();

    res.json(true); // Frontend expects boolean
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};