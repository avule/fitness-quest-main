// backend/src/utils/generateToken.js
// Programer: Nikša Halas
// Datum: 10.05.2025.
// Svrha: Funkcija za generisanje JSON Web Tokena (JWT).

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

module.exports = generateToken;

