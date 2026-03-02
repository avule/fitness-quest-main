// backend/src/models/Badge.js
// Programer: Nikša Halas
// Datum: 08.05.2025.
// Svrha: Mongoose model za značke (Achievements).

const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        requiredLevel: { 
            type: Number,
            required: false, 
            default: 0,
        },
        requiredMissions: { 
            type: Number,
            required: false,
            default: 0,
        },
        
    },
    {
        timestamps: true,
    }
);

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
