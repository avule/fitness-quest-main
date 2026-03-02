// backend/src/routes/authRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za autentifikaciju korisnika (registracija i prijava).

const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController'); 

const router = express.Router();

// Ruta za registraciju
router.post('/register', registerUser);

// Ruta za prijavu
router.post('/login', loginUser);

module.exports = router;
