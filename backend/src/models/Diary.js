// backend/src/models/Diary.js
// Programer: Nikša Halas
// Datum: 08.05.2025.
// Svrha: Mongoose model za unose u dnevnik (sa novim poljima: title, mood, notes).

const mongoose = require('mongoose');

const diarySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: { 
            type: String,
            required: true,
        },
        date: { 
            type: Date,
            required: true,
        },
        mood: { 
            type: String,
            required: true,
        },
        notes: { 
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;
