// backend/src/routes/userRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za upravljanje korisnicima (registracija, prijava, profil).

const express = require('express');
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController'); 
const protect = require('../middleware/authMiddleware'); 

const router = express.Router();

// Registracija novog korisnika
router.post('/', registerUser);

// Prijava korisnika
router.post('/login', authUser);

// Dohvatanje i ažuriranje korisničkog profila (zaštićeno)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
