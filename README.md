# Fitness Quest

Gejmifikovana web aplikacija za pracenje fizickih aktivnosti koja motivise korisnike kroz sistem nivoa, XP nagrada, misija i znacki (achievements).

## Opis

Fitness Quest pretvara svakodnevno vezbanje u avanturu. Korisnici zavrsavaju misije, prate aktivnosti, vode dnevnik raspolozenja i skupljaju XP bodove za napredovanje kroz nivoe. Aplikacija koristi tamnu, modernu temu sa glassmorphism dizajnom.

### Glavne funkcionalnosti

- **Sistem nivoa i XP** - Zavrsi misije i skupljaj iskustvene bodove za napredovanje
- **Misije** - Dnevne i jednokratne misije sa XP nagradama
- **Znacke (Badges)** - Achievements koji se otkljucavaju napredovanjem (npr. "Prvi Koraci", "Misija Master", "Nivo 5 Dostignut")
- **Avatar** - SVG avatar koji evoluira sa svakim novim nivoom (5 nivoa)
- **Dnevnik** - Beleske sa naslovom, datumom i raspolozenjem (Odlicno, Dobro, Neutralno, Lose, Uzasno)
- **Pracenje aktivnosti** - Logovanje vezbi sa tipom, trajanjem, intenzitetom i potrosenim kalorijama
- **Podsetnici** - Kreiranje i pracenje podsetnika za treninge
- **Statistika** - Grafovi trajanja aktivnosti po danu (LineChart) i raspolozenja (BarChart)

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** autentifikacija (jsonwebtoken + bcryptjs)
- **Jest** + **Supertest** za testove

### Frontend
- **React 18** (Create React App)
- **Material UI (MUI) v7** - UI komponente
- **Recharts** - grafovi i vizualizacija podataka
- **React Router v7** - rutiranje
- **Axios** - HTTP zahtevi
- **date-fns** - rad sa datumima

## Struktura projekta

```
fitness-quest-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB konekcija
│   │   ├── controllers/
│   │   │   ├── authController.js   # Registracija i prijava
│   │   │   ├── userController.js   # Profil, XP, nivo, znacke
│   │   │   ├── missionController.js
│   │   │   ├── activityController.js
│   │   │   ├── diaryController.js
│   │   │   └── reminderController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT zastita ruta
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js            # Korisnik (xp, level, badges)
│   │   │   ├── Mission.js         # Misije (daily/jednokratne)
│   │   │   ├── Activity.js        # Aktivnosti
│   │   │   ├── Diary.js           # Dnevnik unosi
│   │   │   ├── Badge.js           # Znacke
│   │   │   └── Reminder.js        # Podsetnici
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── missionRoutes.js
│   │   │   ├── activityRoutes.js
│   │   │   ├── diaryRoutes.js
│   │   │   └── reminderRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js              # Entry point
│   ├── .env
│   ├── nodemon.json
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvatarDisplay.jsx   # SVG avatar po nivou
│   │   │   ├── BadgeDisplay.jsx    # Prikaz znacke
│   │   │   ├── MissionCard.jsx     # Kartica misije
│   │   │   ├── StatsDashboard.jsx  # Grafovi i statistika
│   │   │   ├── XPBar.jsx           # XP progress bar
│   │   │   └── hoc/
│   │   │       └── PrivateRoute.jsx
│   │   ├── screens/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── DiaryScreen.jsx
│   │   │   ├── ActivityScreen.jsx
│   │   │   └── ReminderScreen.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpointi

| Metoda | Ruta | Opis |
|--------|------|------|
| POST | `/api/auth/register` | Registracija korisnika |
| POST | `/api/auth/login` | Prijava korisnika |
| GET | `/api/user/profile` | Profil korisnika |
| GET/POST | `/api/missions` | Misije (CRUD) |
| GET/POST | `/api/activities` | Aktivnosti (CRUD) |
| GET/POST | `/api/diary` | Dnevnik (CRUD) |
| GET/POST | `/api/reminders` | Podsetnici (CRUD) |

## Instalacija i pokretanje

### Preduslovi
- Node.js (v18+)
- MongoDB (lokalni ili Atlas)

### Backend

```bash
cd backend
npm install
```

Kreiraj `.env` fajl u `backend/` folderu:

```env
MONGO_URI=tvoj_mongodb_connection_string
JWT_SECRET=tvoj_tajni_kljuc
```

Pokretanje:

```bash
npm run dev    # development (nodemon)
npm start      # production
npm test       # testovi
```

Server se pokrece na `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Aplikacija se otvara na `http://localhost:3000`.

## Autori

- **Niksa Halas** - Backend, modeli, kontroleri, rute, konfiguracija
- **Andrija Vulesevic** - Frontend komponente (Avatar, Badge, XP Bar, Stats Dashboard, Mission Card)
