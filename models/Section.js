const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[A-Z][a-z0-9]*(?:\s+[A-Z][a-z0-9]*)*$/.test(v);
            },
            message: 'Section name must start with capital letters'
        }
    },
    sectionDescription: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    isMainTask: {
        type: Boolean,
        default: false
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema); 