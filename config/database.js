const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection URL:', config.db.url);
        
        const conn = await mongoose.connect(config.db.url, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test database connection
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 