const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Course = require('../models/Course');

// // Status check
// router.get('/status', async (req, res) => {
//     try {
//         const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
//         const memberCount = await Member.countDocuments();
//         res.json({
//             status: 'ok',
//             database: dbStatus,
//             memberCount: memberCount,
//             session: req.session ? 'active' : 'none'
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             error: error.message
//         });
//     }
// });

// // Load members from JSON file
// const loadMembers = async () => {
//     try {
//         const data = await fs.readFile(path.join(__dirname, '../data/members.json'), 'utf8');
//         const members = JSON.parse(data);
        
//         for (const member of members) {
//             const existingMember = await Member.findOne({ username: member.username });
//             if (!existingMember) {
//                 await Member.create({
//                     username: member.username,
//                     password: member.password
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Error loading members:', error);
//     }
// };

// // Load courses from JSON file
// const loadCourses = async () => {
//     try {
//         const data = await fs.readFile(path.join(__dirname, '../data/courses.json'), 'utf8');
//         const courses = JSON.parse(data);
        
//         for (const course of courses) {
//             const existingCourse = await Course.findOne({ courseName: course.courseName });
//             if (!existingCourse) {
//                 await Course.create(course);
//             }
//         }
//     } catch (error) {
//         console.error('Error loading courses:', error);
//     }
// };

// // Check members in database
// router.get('/check', async (req, res) => {
//     try {
//         const members = await Member.find({}, '-password');
//         res.json(members);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Reset database and reload data
// router.get('/reset', async (req, res) => {
//     try {
//         await Member.deleteMany({});
//         await Course.deleteMany({});
//         await loadMembers();
//         await loadCourses();
//         res.send('Database reset successfully');
//     } catch (error) {
//         res.status(500).send('Error resetting database: ' + error.message);
//     }
// });

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// Login process
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const member = await Member.findOne({ username });
        
        if (!member || !(await member.comparePassword(password))) {
            return res.status(401).render('auth/login', { 
                error: 'Invalid username or password' 
            });
        }

        req.session.user = {
            id: member._id,
            username: member.username
        };
        
        res.redirect('/view/sessions');
    } catch (error) {
        res.status(500).render('auth/login', { 
            error: 'An error occurred during login' 
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/view/auth/login');
});

module.exports = router; 