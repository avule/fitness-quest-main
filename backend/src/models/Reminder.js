// backend/src/models/Reminder.js
// Programer: Nikša Halas
// Datum: 08.05.2025.
// Svrha: Model za podsetnike korisnika.

const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { 
        type: String,
        required: true,
        maxlength: 100
    },
    description: { 
        type: String,
        maxlength: 500
    },
    dateTime: { 
        type: Date,
        required: true
    },
    isCompleted: { 
        type: Boolean,
        default: false
    },
 
}, {
    timestamps: true
});

module.exports = mongoose.model('Reminder', ReminderSchema);
