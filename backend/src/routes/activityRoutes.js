// backend/src/routes/activityRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za upravljanje aktivnostima korisnika.

const express = require('express');
const { createActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta za kreiranje nove aktivnosti
router.post('/', protect, createActivity);

// Ruta za dohvatanje svih aktivnosti za prijavljenog korisnika
router.get('/', protect, getActivities);

// Ruta za ažuriranje aktivnosti
router.put('/:id', protect, updateActivity);

// Ruta za brisanje aktivnosti
router.delete('/:id', protect, deleteActivity);

module.exports = router;
