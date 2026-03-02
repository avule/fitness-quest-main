// backend/src/models/Activity.js
// Programer: Nikša Halas
// Datum: 08.05.2025.
// Svrha: Model za aktivnosti korisnika.

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { 
        type: String,
        required: true
    },
    activityType: { 
        type: String,
        required: true
    },
    duration: { 
        type: Number,
        required: true,
        min: 0
    },
    caloriesBurned: { 
        type: Number
    },
    intensity: { 
        type: String,
        enum: ['Nizak', 'Srednji', 'Visok'],
        default: 'Srednji'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
