const { console } = require('inspector');
const { Course } = require('../models/Course');
const { User } = require('../models/User');

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
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push(userId);
    await course.save();

    // Add course to user's enrolled courses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.json(true); // Frontend expects boolean
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ 
      message: 'Error enrolling in course',
      error: error.message 
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