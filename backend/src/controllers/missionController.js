// backend/src/controllers/missionController.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Kontroleri za upravljanje misijama i logikom kompletiranja, uključujući automatsko i manuelno resetovanje dnevnih misija.

const asyncHandler = require('express-async-handler');
const Mission = require('../models/Mission');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { startOfDay } = require('date-fns');

// Funkcija za izračunavanje XP-a potrebnog za sledeći nivo
const calculateXpToNextLevel = (level) => {
    return level * 100;
};

// Pomoćna funkcija za automatsko resetovanje dnevnih misija
const autoResetDailyMissions = async () => {
    console.log(`[DEBUG] Pokrećem automatsko resetovanje dnevnih misija.`);
    const todayStart = startOfDay(new Date());

    const missionsToConsider = await Mission.find({ isDaily: true });
    let resetCount = 0;

    for (const mission of missionsToConsider) {
        if (!mission.lastResetDate || startOfDay(mission.lastResetDate).getTime() !== todayStart.getTime()) {
            mission.completedBy = []; 
            mission.lastResetDate = todayStart; 
            await mission.save();
            resetCount++;
            console.log(`[DEBUG] Automatski resetovana misija: ${mission.name}`);
        }
    }
    if (resetCount > 0) {
        console.log(`[DEBUG] Automatski resetovano ${resetCount} dnevnih misija.`);
    } else {
        console.log(`[DEBUG] Nema dnevnih misija za automatsko resetovanje (ili su već resetovane danas).`);
    }
};


const getMissions = asyncHandler(async (req, res) => {
    await autoResetDailyMissions();
    const missions = await Mission.find({});
    missions.forEach(m => console.log(`[DEBUG] Misija: ${m.name}, isDaily: ${m.isDaily}, completedBy: ${m.completedBy.length > 0 ? 'true' : 'false'}`));
    res.json(missions);
});


const completeMission = asyncHandler(async (req, res) => {
    const missionId = req.params.id;
    const userId = req.user.id;

    console.log(`[DEBUG] Attempting to complete mission: ${missionId} for user: ${userId}`);

    const mission = await Mission.findById(missionId);
    if (!mission) {
        console.error(`[DEBUG] Mission not found: ${missionId}`);
        res.status(404);
        throw new Error('Misija nije pronađena.');
    }
    console.log(`[DEBUG] Mission found: ${mission.name}`);

    const user = await User.findById(userId);
    if (!user) {
        console.error(`[DEBUG] User not found: ${userId}`);
        res.status(404);
        throw new Error('Korisnik nije pronađen.');
    }
    console.log(`[DEBUG] User found: ${user.username}, current XP: ${user.xp}, level: ${user.level}`);

    // Proveri da li je misija već izvrsena od strane ovog korisnika
    if (mission.completedBy && mission.completedBy.includes(userId)) {
        console.warn(`[DEBUG] Mission ${missionId} already completed by user ${userId}`);
        res.status(400);
        throw new Error('Misija je već kompletirana.');
    }
    console.log(`[DEBUG] Mission not yet completed by user. Proceeding.`);

    // Ažuriraj misiju: dodavanje korisnika u completedBy
    mission.completedBy.push(userId);
    if (mission.isDaily) {
        mission.lastResetDate = new Date();
        console.log(`[DEBUG] Daily mission completed, updating lastResetDate to: ${mission.lastResetDate}`);
    }
    await mission.save();
    console.log(`[DEBUG] Mission ${mission.name} updated with completedBy user.`);

    // Ažuriraj korisnika: dodaj XP, proveri nivo, dodeli značke
    user.xp += mission.xpReward;
    user.completedMissionsCount += 1;

    let xpGained = mission.xpReward;
    let newlyAwardedBadges = [];
    let userLevelBefore = user.level;

    console.log(`[DEBUG] User XP after mission: ${user.xp}, completed missions count: ${user.completedMissionsCount}`);

    // Logika za level up
    let xpRequiredForCurrentLevel = calculateXpToNextLevel(user.level);
    console.log(`[DEBUG] Initial XP required for current level (${user.level}): ${xpRequiredForCurrentLevel}`);

    while (user.xp >= xpRequiredForCurrentLevel) {
        console.log(`[DEBUG] User XP (${user.xp}) >= XP required for level ${user.level} (${xpRequiredForCurrentLevel}). Leveling up!`);
        user.xp -= xpRequiredForCurrentLevel;
        user.level += 1;
        xpRequiredForCurrentLevel = calculateXpToNextLevel(user.level);
        console.log(`[DEBUG] New level: ${user.level}, XP remaining: ${user.xp}, XP required for next level: ${xpRequiredForCurrentLevel}`);

        // Proveri da li novi nivo donosi značku
        const badgeForLevel = await Badge.findOne({ requiredLevel: user.level });
        if (badgeForLevel) {
            console.log(`[DEBUG] Found badge for new level ${user.level}: ${badgeForLevel.name}`);
            if (!user.badges.includes(badgeForLevel._id)) {
                user.badges.push(badgeForLevel._id);
                newlyAwardedBadges.push(badgeForLevel);
                console.log(`[DEBUG] Awarded new level badge: ${badgeForLevel.name}`);
            } else {
                console.log(`[DEBUG] User already has badge for level ${user.level}.`);
            }
        } else {
            console.log(`[DEBUG] No badge found for new level ${user.level}.`);
        }
    }

    // Proveri značke koje se dodeljuju na osnovu broja završenih misija
    console.log(`[DEBUG] Checking for badges based on completed missions count (${user.completedMissionsCount}).`);
    const badgesForCompletedMissions = await Badge.find({ requiredMissions: { $lte: user.completedMissionsCount } });
    for (const badge of badgesForCompletedMissions) {
        if (!user.badges.includes(badge._id)) {
            user.badges.push(badge._id);
            newlyAwardedBadges.push(badge);
            console.log(`[DEBUG] Awarded new mission count badge: ${badge.name}`);
        } else {
            console.log(`[DEBUG] User already has badge for mission count: ${badge.name}.`);
        }
    }
    console.log(`[DEBUG] Newly awarded badges (IDs): ${newlyAwardedBadges.map(b => b._id)}`);

    await user.save();
    console.log(`[DEBUG] User saved successfully.`);

    const xpToNextLevel = calculateXpToNextLevel(user.level);

    // Popuni značke da bi se na frontendu prikazali detalji
    const populatedBadges = await Promise.all(newlyAwardedBadges.map(async badge => {
        return await Badge.findById(badge._id);
    }));
    console.log(`[DEBUG] Populated badges for response: ${populatedBadges.map(b => b.name)}`);

    res.json({
        message: 'Misija uspešno kompletirana!',
        userXp: user.xp,
        userLevel: user.level,
        xpToNextLevel: xpToNextLevel,
        xpGained: xpGained,
        newlyAwardedBadges: populatedBadges,
        userLevelBefore: userLevelBefore
    });
    console.log(`[DEBUG] Response sent.`);
});


const resetDailyMissions = asyncHandler(async (req, res) => {
    console.log(`[DEBUG] Pokrećem manuelno resetovanje dnevnih misija.`);
    const missionsToReset = await Mission.find({ isDaily: true }); 

    if (missionsToReset.length === 0) {
        console.log(`[DEBUG] Nema dnevnih misija za manuelno resetovanje.`);
        return res.status(200).json({ message: 'Nema dnevnih misija za resetovanje.' });
    }

    let resetCount = 0;
    for (const mission of missionsToReset) {
        mission.completedBy = []; 
        mission.lastResetDate = null; 
        await mission.save();
        resetCount++;
        console.log(`[DEBUG] Manuelno resetovana misija: ${mission.name}, lastResetDate postavljen na NULL.`);
    }

    res.status(200).json({ message: `Uspešno resetovano ${resetCount} dnevnih misija. Osvežite stranicu da vidite promene.` });
    console.log(`[DEBUG] Manuelno resetovanje dnevnih misija završeno. Broj resetovanih: ${resetCount}`);
});


module.exports = {
    getMissions,
    completeMission,
    resetDailyMissions,
};
