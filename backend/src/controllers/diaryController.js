// backend/src/controllers/diaryController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za upravljanje dnevnikom aktivnosti i osećanja sa novim poljima.

const asyncHandler = require('express-async-handler');
const Diary = require('../models/Diary');


const createDiaryEntry = asyncHandler(async (req, res) => {
    const { title, mood, date, notes } = req.body;

    console.log(`[BACKEND-DEBUG] createDiaryEntry - Primljen Naslov: ${title}, Raspoloženje: ${mood}, Datum: ${date}, Beleške: ${notes}`);

    // Validacija obaveznih polja
    if (!title || !mood || !date) {
        let missingFields = [];
        if (!title) missingFields.push('naslov');
        if (!mood) missingFields.push('raspoloženje');
        if (!date) missingFields.push('datum');
        console.error(`[BACKEND-ERROR] createDiaryEntry - Nedostaju obavezna polja: ${missingFields.join(' i ')}`);

        res.status(400);
        throw new Error(`Molimo unesite ${missingFields.join(' i ')} za dnevnik.`);
    }

    try {
        const diaryEntry = await Diary.create({
            user: req.user._id,
            title,
            mood,
            date,
            notes,
        });
        console.log(`[BACKEND-DEBUG] Dnevnik unos uspešno kreiran: ${diaryEntry._id}`);
        res.status(201).json(diaryEntry);
    } catch (dbError) {
        console.error(`[BACKEND-ERROR] Greška pri čuvanju u bazu: ${dbError.message}`);
        res.status(500);
        throw new Error('Greška pri čuvanju unosa u bazu podataka.');
    }
});


const getDiaryEntries = asyncHandler(async (req, res) => {
    try {
        const diaryEntries = await Diary.find({ user: req.user._id }).sort({ date: -1 });
        res.json(diaryEntries);
    } catch (dbError) {
        console.error(`[BACKEND-ERROR] Greška pri dohvatanju unosa iz baze: ${dbError.message}`);
        res.status(500);
        throw new Error('Greška pri dohvatanju unosa iz baze podataka.');
    }
});


const updateDiaryEntry = asyncHandler(async (req, res) => {
    const { title, mood, date, notes } = req.body; 
    const diaryEntry = await Diary.findById(req.params.id);

    console.log(`[BACKEND-DEBUG] updateDiaryEntry - Primljen Naslov: ${title}, Raspoloženje: ${mood}, Datum: ${date}, Beleške: ${notes} za ID: ${req.params.id}`);

    if (!title || !mood || !date) {
        let missingFields = [];
        if (!title) missingFields.push('naslov');
        if (!mood) missingFields.push('raspoloženje');
        if (!date) missingFields.push('datum');
        console.error(`[BACKEND-ERROR] updateDiaryEntry - Nedostaju obavezna polja za ažuriranje: ${missingFields.join(' i ')}`);
        res.status(400);
        throw new Error(`Molimo unesite ${missingFields.join(' i ')} za ažuriranje dnevnika.`);
    }

    if (diaryEntry && diaryEntry.user.toString() === req.user._id.toString()) {
        diaryEntry.title = title || diaryEntry.title;
        diaryEntry.mood = mood || diaryEntry.mood;
        diaryEntry.date = date || diaryEntry.date;
        diaryEntry.notes = notes || diaryEntry.notes; 

        try {
            const updatedEntry = await diaryEntry.save();
            console.log(`[BACKEND-DEBUG] Dnevnik unos uspešno ažuriran: ${updatedEntry._id}`);
            res.json(updatedEntry);
        } catch (dbError) {
            console.error(`[BACKEND-ERROR] Greška pri ažuriranju u bazi: ${dbError.message}`);
            res.status(500);
            throw new Error('Greška pri ažuriranju unosa u bazu podataka.');
        }
    } else {
        res.status(404);
        throw new Error('Dnevnik unosa nije pronađen ili niste autorizovani.');
    }
});


const deleteDiaryEntry = asyncHandler(async (req, res) => {
    const diaryEntry = await Diary.findById(req.params.id);

    if (diaryEntry && diaryEntry.user.toString() === req.user._id.toString()) {
        try {
            await diaryEntry.deleteOne();
            console.log(`[BACKEND-DEBUG] Dnevnik unos uspešno obrisan: ${req.params.id}`);
            res.json({ message: 'Dnevnik unosa uspešno obrisan.' });
        } catch (dbError) {
            console.error(`[BACKEND-ERROR] Greška pri brisanju iz baze: ${dbError.message}`);
            res.status(500);
            throw new Error('Greška pri brisanju unosa iz baze podataka.');
        }
    } else {
        res.status(404);
        throw new Error('Dnevnik unosa nije pronađen ili niste autorizovani.');
    }
});

module.exports = {
    createDiaryEntry,
    getDiaryEntries,
    updateDiaryEntry,
    deleteDiaryEntry,
};
