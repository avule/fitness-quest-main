// backend/src/controllers/authController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za autentifikaciju korisnika (registracija i prijava).

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Proveri da li korisnik postoji
    const user = await User.findOne({ email });

    // Proveri lozinku
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            completedMissionsCount: user.completedMissionsCount,
        });
    } else {
        res.status(401);
        throw new Error('Nevažeći email ili lozinka');
    }
});


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('Korisnik sa tim emailom već postoji');
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            completedMissionsCount: user.completedMissionsCount,
        });
    } else {
        res.status(400);
        throw new Error('Nevažeći korisnički podaci');
    }
});

module.exports = {
    loginUser,
    registerUser,
};
