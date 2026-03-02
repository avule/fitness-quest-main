// backend/src/routes/diaryRoutes.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Rute za upravljanje unosima u dnevnik.

const express = require('express');
const { createDiaryEntry, getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } = require('../controllers/diaryController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createDiaryEntry);
router.get('/', protect, getDiaryEntries);
router.put('/:id', protect, updateDiaryEntry);
router.delete('/:id', protect, deleteDiaryEntry);

module.exports = router;