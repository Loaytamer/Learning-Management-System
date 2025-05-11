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

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.use(auth);

// Student routes
router.post('/:id/enroll', enrollInCourse);
router.post('/:id/unenroll', unenrollFromCourse);

// Instructor routes (require instructor role)
const isInstructor = require('../middleware/isInstructor');
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id',  deleteCourse);
router.post('/:id/lessons',  addLesson);

module.exports = router;