// backend/src/models/Mission.js
// Programer: Nikša Halas
// Datum: 08.05.2025.
// Svrha: Mongoose model za misije sa dodatnim poljem za datum poslednjeg resetovanja.

const mongoose = require('mongoose');

const missionSchema = mongoose.Schema(
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
        xpReward: {
            type: Number,
            required: true,
            default: 150, 
        },
        isDaily: { 
            type: Boolean,
            default: false,
        },
        completedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        lastResetDate: { 
            type: Date,
            default: Date.now, 
        },
    },
    {
        timestamps: true,
    }
);

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
