const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Course = require('../models/Course');
const { isAuthenticated } = require('../middleware/auth');

// Get all sections
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const sections = await Section.find({ user: req.session.user._id }).populate('course');
        const courses = await Course.find();
        res.render('sessions/index', { 
            sections, 
            courses,
            error: null,
            success: null
        });
    } catch (error) {
        res.render('sessions/index', {
            sections: [],
            courses: [],
            error: 'Failed to load sections',
            success: null
        });
    }
});

// Get section by ID (for editing)
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const section = await Section.findOne({ 
            _id: req.params.id,
            user: req.session.user._id 
        });
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch section' });
    }
});

// Create new section
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { sectionName, sectionDescription, duration, course, isMainTask } = req.body;
        
        const nameRegex = /^[A-Z][a-z0-9]*(?:\s+[A-Z][a-z0-9]*)*$/;
        if (!nameRegex.test(sectionName)) {
            return res.render('sessions/index', {
                sections: await Section.find({ user: req.session.user._id }).populate('course'),
                courses: await Course.find(),
                error: 'Section name must start with capital letters',
                success: null
            });
        }

        await Section.create({
            sectionName,
            sectionDescription,
            duration,
            course,
            isMainTask: isMainTask === 'on',
            user: req.session.user._id
        });

        res.redirect('/view/sessions');
    } catch (error) {
        res.render('sessions/index', {
            sections: await Section.find({ user: req.session.user._id }).populate('course'),
            courses: await Course.find(),
            error: 'Failed to create section',
            success: null
        });
    }
});

// Update section
router.post('/:id', isAuthenticated, async (req, res) => {
    try {
        const { sectionName, sectionDescription, duration, course, isMainTask } = req.body;
        
        const nameRegex = /^[A-Z][a-z0-9]*(?:\s+[A-Z][a-z0-9]*)*$/;
        if (!nameRegex.test(sectionName)) {
            return res.render('sessions/index', {
                sections: await Section.find({ user: req.session.user._id }).populate('course'),
                courses: await Course.find(),
                error: 'Section name must start with capital letters',
                success: null
            });
        }

        const section = await Section.findOneAndUpdate(
            { 
                _id: req.params.id,
                user: req.session.user._id 
            },
            {
                sectionName,
                sectionDescription,
                duration,
                course,
                isMainTask: isMainTask === 'on'
            },
            { new: true }
        );

        if (!section) {
            return res.render('sessions/index', {
                sections: await Section.find({ user: req.session.user._id }).populate('course'),
                courses: await Course.find(),
                error: 'Section not found',
                success: null
            });
        }

        res.redirect('/view/sessions');
    } catch (error) {
        res.render('sessions/index', {
            sections: await Section.find({ user: req.session.user._id }).populate('course'),
            courses: await Course.find(),
            error: 'Failed to update section',
            success: null
        });
    }
});

// Delete section
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const section = await Section.findOneAndDelete({ 
            _id: req.params.id,
            user: req.session.user._id 
        });
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete section' });
    }
});

module.exports = router; 