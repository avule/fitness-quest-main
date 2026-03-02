// backend/src/controllers/userController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za upravljanje korisnicima i njihovim profilima.

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('badges');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            completedMissionsCount: user.completedMissionsCount,
        });
    } else {
        res.status(404);
        throw new Error('Korisnik nije pronađen');
    }
});


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
            xp: updatedUser.xp,
            level: updatedUser.level,
            badges: updatedUser.badges,
            completedMissionsCount: updatedUser.completedMissionsCount,
        });
    } else {
        res.status(404);
        throw new Error('Korisnik nije pronađen');
    }
});


module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
};
