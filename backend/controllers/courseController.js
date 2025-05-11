const { Course } = require('../models/Course');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
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
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user:" , req.user);
    const courseData = {
      ...req.body,
      instructor: userId || 'Unknown',
      instructorName: req.user.username || 'Unknown',
    };

    const course = new Course(courseData);
    console.log(course);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentIndex = course.enrolledStudents.indexOf(userId);
    if (studentIndex === -1) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    course.enrolledStudents.splice(studentIndex, 1);
    await course.save();

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    res.status(500).json({ message: 'Error unenrolling from course', error });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    course.lessons.push(req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error });
  }
};