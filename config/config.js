require('dotenv').config();

// Log environment variables
console.log('Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('SECRET_KEY:', process.env.SECRET_KEY);

module.exports = {
    // Database configuration
    db: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/trialtest'
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.SECRET_KEY || 'se180197',
        expiresIn: '1h'
    },
    
    // Server configuration
    server: {
        port: process.env.PORT || 3000
    }
}; 