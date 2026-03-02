// backend/src/routes/reminderRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za upravljanje podsetnicima.

const express = require('express');
const { createReminder, getReminders, updateReminder, deleteReminder } = require('../controllers/reminderController');
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

// Ruta za kreiranje novog podsetnika
router.post('/', protect, createReminder);

// Ruta za dohvatanje svih podsetnika za prijavljenog korisnika
router.get('/', protect, getReminders);

// Ruta za ažuriranje podsetnika (npr. označavanje kao kompletiranog)
router.put('/:id', protect, updateReminder);

// Ruta za brisanje podsetnika
router.delete('/:id', protect, deleteReminder);

module.exports = router;
