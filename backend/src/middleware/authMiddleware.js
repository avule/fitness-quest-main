// backend/src/middleware/authMiddleware.js
//Programer: Nikša Halas
//Datum: 08.05.2025.
//Svrha: Middleware za zaštitu ruta i autentifikaciju korisnika putem JWT tokena.

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password'); // Očekuje da JWT payload ima 'id' polje

      next(); // Nastavi na sledeći middleware ili ruter
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Niste autorizovani, token nije uspeo');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Niste autorizovani, nema tokena');
  }
});

module.exports = protect;