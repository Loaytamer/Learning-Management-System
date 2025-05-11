const express = require('express');
const auth = require('../middleware/auth');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  addLesson
} = require('../controllers/courseController');
const router = express.Router();

// Public routes (no authentication required)
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.use(auth);

// Student routes (authenticated users)
router.post('/:id/enroll', enrollInCourse);
router.post('/:id/unenroll', unenrollFromCourse);

// Instructor routes (require instructor role)
const isInstructor = require('../middleware/isInstructor');
router.post('/', isInstructor, createCourse);
router.put('/:id', isInstructor, updateCourse);
router.delete('/:id', isInstructor, deleteCourse);
router.post('/:id/lessons', isInstructor, addLesson);

module.exports = router;