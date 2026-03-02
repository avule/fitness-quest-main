// backend/src/server.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Glavni ulazni fajl za backend aplikaciju, postavlja server i rute.

const dotenv = require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const missionRoutes = require('./routes/missionRoutes');
const userRoutes = require('./routes/userRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

// Ovo sprečava dvostruko povezivanje tokom testiranja
if (require.main === module) {
    connectDB();
}

const app = express();

// Middleware za parsiranje JSON tela zahteva
app.use(express.json());

// Middleware za parsiranje URL-encoded tela zahteva (ako je potrebno)
app.use(express.urlencoded({ extended: false }));

// Omogući CORS za sve rute (za razvoj)
app.use(cors());

// Definisanje ruta
app.use('/api/missions', missionRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/reminders', reminderRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/auth', authRoutes); 


app.get('/', (req, res) => {
    res.send('API je pokrenut...');
});

// Middleware za rukovanje greškama (mora biti na kraju)
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
}

module.exports = app;
