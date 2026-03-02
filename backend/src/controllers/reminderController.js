// backend/src/controllers/reminderController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za upravljanje podsetnicima.

const asyncHandler = require('express-async-handler');
const Reminder = require('../models/Reminder');


const createReminder = asyncHandler(async (req, res) => {
    const { title, description, dateTime } = req.body;
    const userId = req.user.id;

    if (!title || !dateTime) {
        res.status(400);
        throw new Error('Molimo unesite naslov i datum/vreme za podsetnik.');
    }

    const newReminder = new Reminder({
        userId,
        title,
        description,
        dateTime: new Date(dateTime) 
    });

    const reminder = await newReminder.save();
    res.status(201).json(reminder);
});


const getReminders = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const reminders = await Reminder.find({ userId }).sort({ dateTime: 1 });
    res.status(200).json(reminders);
});


const updateReminder = asyncHandler(async (req, res) => {
    const { title, description, dateTime, isCompleted } = req.body;
    const reminderId = req.params.id;
    const userId = req.user.id;

    let reminder = await Reminder.findById(reminderId);

    if (!reminder) {
        res.status(404);
        throw new Error('Podsetnik nije pronađen.');
    }


    if (reminder.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da ažurirate ovaj podsetnik.');
    }

    reminder.title = title || reminder.title;
    reminder.description = description || reminder.description;
    reminder.dateTime = dateTime ? new Date(dateTime) : reminder.dateTime;
    reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

    const updatedReminder = await reminder.save();
    res.status(200).json(updatedReminder);
});


const deleteReminder = asyncHandler(async (req, res) => {
    const reminderId = req.params.id;
    const userId = req.user.id;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
        res.status(404);
        throw new Error('Podsetnik nije pronađen.');
    }

    if (reminder.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da obrišete ovaj podsetnik.');
    }

    await reminder.deleteOne(); 
    res.status(200).json({ message: 'Podsetnik uspešno obrisan.' });
});

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
};
