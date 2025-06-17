const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const coursesController = require('../controllers/coursesController');

// Apply verifyToken middleware to all routes
router.use(authController.verifyToken);

// Get all courses
router.get('/', coursesController.getCourse);

// Get course by ID
router.get('/:id', coursesController.getCourseById);

// Create new course
router.post('/', coursesController.validateCourse, coursesController.createCourse);

// Update course
router.put('/:id', coursesController.validateCourse, coursesController.updateCourse);

// Delete course
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;