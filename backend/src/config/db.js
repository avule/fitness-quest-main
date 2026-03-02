// backend/src/config/db.js
// Programer: Nikša Halas
// Datum: 07.05.2025.
// Svrha: Konfiguracija i uspostavljanje veze sa MongoDB bazom podataka.

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`Pokušavam da se povežem na MongoDB sa URI: ${process.env.MONGO_URI ? '***** (skriveno)' : 'undefined'}`); 
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
