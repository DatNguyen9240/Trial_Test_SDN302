const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const config = require('../config/config');

// Login controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username && password) {
            // Find member by username
            const member = await Member.findOne({ username });
            
            if (!member) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            // TODO: Add password comparison here
            // For now, we'll just check if the password matches
            if (member.password !== password) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            const payload = {
                id: member._id,
                username: member.username
            };
            
            const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
            res.json({ 
                success: true,
                message: 'Login successful',
                token 
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Please provide username and password' 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid token' 
                });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying token',
            error: error.message
        });
    }
};