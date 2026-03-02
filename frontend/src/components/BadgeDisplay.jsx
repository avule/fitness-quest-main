// frontend/src/components/BadgeDisplay.jsx
// Programer: Andrija Vulešević
// Datum: 11.05.2025.
// Svrha: Prikazuje pojedinačnu značku sa modernim dizajnom i inline SVG ikonama.

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const BadgeDisplay = ({ badge }) => {
  const theme = useTheme();

  // Funkcija koja vraća SVG za značku na osnovu njenog imena/tipa
  const getBadgeSvg = (badgeName) => {
    const baseColor = theme.palette.secondary.main; 
    const accentColor = theme.palette.primary.main; 

    switch (badgeName) {
      case 'Prvi Koraci':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill={baseColor} opacity="0.8" />
            <text x="50" y="55" textAnchor="middle" fontSize="40" fontWeight="bold" fill="white">1</text>
            <circle cx="80" cy="20" r="10" fill={accentColor} />
          </svg>
        );
      case 'Misija Master':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="15" fill={baseColor} opacity="0.8" />
            <path d="M25 50 L45 70 L75 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="20" r="10" fill={accentColor} />
            <circle cx="20" cy="80" r="10" fill={accentColor} />
          </svg>
        );
      case 'Nivo 5 Dostignut': 
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50 5, 95 40, 80 95, 20 95, 5 40" fill={accentColor} opacity="0.8" />
            <text x="50" y="60" textAnchor="middle" fontSize="45" fontWeight="bold" fill="white">5</text>
            <circle cx="50" cy="25" r="10" fill="white" />
          </svg>
        );
      default:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="10" fill="gray" opacity="0.5" />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fill="white">?</text>
          </svg>
        );
    }
  };

  return (
    <Box sx={{
      textAlign: 'center',
      m: 1,
      p: 1.5,
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '80px',
      maxWidth: '100px',
      flexShrink: 0,
    }}>
      <Box sx={{ width: 50, height: 50, borderRadius: '50%', border: `2px solid ${theme.palette.secondary.main}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {getBadgeSvg(badge.name)} 
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 0.8, fontWeight: 'medium', color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
        {badge.name}
      </Typography>
    </Box>
  );
};

export default BadgeDisplay;
