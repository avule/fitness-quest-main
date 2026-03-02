// backend/src/controllers/activityController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za upravljanje aktivnostima.

const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity'); 


const createActivity = asyncHandler(async (req, res) => {
    const { name, activityType, duration, caloriesBurned, intensity, date } = req.body;
    const userId = req.user.id;

    if (!name || !activityType || !duration || !intensity) {
        res.status(400);
        throw new Error('Molimo unesite sva obavezna polja za aktivnost: Naziv, Tip, Trajanje, Intenzitet.');
    }

    const newActivity = new Activity({
        userId,
        name,
        activityType,
        duration,
        caloriesBurned,
        intensity,
        date: date || Date.now() 
    });

    const activity = await newActivity.save();
    res.status(201).json(activity);
});


const getActivities = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Dohvati aktivnosti, sortiraj po datumu opadajuće
    const activities = await Activity.find({ userId }).sort({ date: -1 });
    res.status(200).json(activities);
});


const updateActivity = asyncHandler(async (req, res) => {
    const { name, activityType, duration, caloriesBurned, intensity, date } = req.body;
    const activityId = req.params.id;
    const userId = req.user.id;

    let activity = await Activity.findById(activityId);

    if (!activity) {
        res.status(404);
        throw new Error('Aktivnost nije pronađena.');
    }

    // Proveri da li korisnik poseduje aktivnost
    if (activity.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da ažurirate ovu aktivnost.');
    }

    activity.name = name || activity.name;
    activity.activityType = activityType || activity.activityType;
    activity.duration = duration !== undefined ? duration : activity.duration;
    activity.caloriesBurned = caloriesBurned !== undefined ? caloriesBurned : activity.caloriesBurned;
    activity.intensity = intensity || activity.intensity;
    activity.date = date ? new Date(date) : activity.date;

    const updatedActivity = await activity.save();
    res.status(200).json(updatedActivity);
});


const deleteActivity = asyncHandler(async (req, res) => {
    const activityId = req.params.id;
    const userId = req.user.id;

    const activity = await Activity.findById(activityId);

    if (!activity) {
        res.status(404);
        throw new Error('Aktivnost nije pronađena.');
    }

    // Proveri da li korisnik poseduje aktivnost
    if (activity.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da obrišete ovu aktivnost.');
    }

    await activity.deleteOne();
    res.status(200).json({ message: 'Aktivnost uspešno obrisana.' });
});

module.exports = {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
};
