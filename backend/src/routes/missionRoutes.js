// backend/src/routes/missionRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za upravljanje misijama, uključujući resetovanje dnevnih misija.

const express = require('express');
const { getMissions, completeMission, resetDailyMissions } = require('../controllers/missionController'); 
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

// Ruta za dohvatanje svih misija
router.get('/', protect, getMissions);

// Ruta za kompletiranje misije
router.post('/complete/:id', protect, completeMission);

// Ruta za resetovanje dnevnih misija (za demo, dostupna prijavljenim korisnicima)
router.post('/reset-daily', protect, resetDailyMissions);

module.exports = router;
