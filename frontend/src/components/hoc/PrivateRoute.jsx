// frontend/src/components/hoc/PrivateRoute.jsx
// Programer: Andrija Vulešević
// Datum: 11.05.2025.
// Svrha: Komponenta za zaštitu ruta, omogućava pristup samo prijavljenim korisnicima.

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');

  return userInfo ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;