const Course = require('../models/Course');
const Section = require('../models/Section');

// Courses controller
const courses = [
    { id: 1, name: 'Web Development', instructor: 'John Doe', description: 'Learn web development' },
    { id: 2, name: 'Mobile Development', instructor: 'Jane Smith', description: 'Learn mobile development' }
];

// Validation middleware
exports.validateCourse = (req, res, next) => {
    const { courseName, courseDescription } = req.body;
    
    // Check required fields
    if (!courseName || !courseDescription) {
        return res.status(400).json({
            success: false,
            message: 'Course name and description are required fields'
        });
    }

    // Validate course name length
    if (courseName.length < 3 || courseName.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'Course name must be between 3 and 50 characters'
        });
    }

    // Validate description length
    if (courseDescription.length < 10 || courseDescription.length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Course description must be between 10 and 500 characters'
        });
    }

    next();
};

exports.getCourse = async (req, res) => {
    try {
        const courses = await Course.find().populate('sections');
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('sections');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription } = req.body;
        
        const newCourse = new Course({
            courseName,
            courseDescription
        });
        
        await newCourse.save();
        
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: newCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { courseName, courseDescription } = req.body;
        
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        course.courseName = courseName;
        course.courseDescription = courseDescription;
        
        await course.save();
        
        res.json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating course',
            error: error.message
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Delete all sections associated with this course
        await Section.deleteMany({ course: course._id });
        
        // Delete the course
        await course.deleteOne();
        
        res.json({
            success: true,
            message: 'Course and its sections deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting course',
            error: error.message
        });
    }
};