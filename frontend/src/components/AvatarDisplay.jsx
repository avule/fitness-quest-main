// frontend/src/components/AvatarDisplay.jsx
// Programer: Andrija Vulešević
// Datum: 11.05.2025.
// Svrha: Prikazuje avatar korisnika na osnovu nivoa sa modernim dizajnom i inline SVG avatarima.

import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AvatarDisplay = ({ level }) => {
  const theme = useTheme();

  // Funkcija koja vraća SVG za avatar na osnovu nivoa
  const getAvatarSvg = (currentLevel) => {
    const baseColor = theme.palette.primary.main; 
    const accentColor = theme.palette.secondary.main; 

    switch (currentLevel) {
      case 1:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill={baseColor} />
            <circle cx="50" cy="40" r="15" fill="white" />
            <rect x="35" y="60" width="30" height="15" rx="7.5" fill="white" />
          </svg>
        );
      case 2:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill={baseColor} />
            <circle cx="50" cy="40" r="18" fill="white" /> 
            <rect x="30" y="60" width="40" height="20" rx="10" fill="white" /> 
            <circle cx="35" cy="35" r="5" fill={accentColor} /> 
          </svg>
        );
      case 3:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill={baseColor} />
            <circle cx="50" cy="40" r="20" fill="white" />
            <rect x="25" y="60" width="50" height="25" rx="12.5" fill="white" />
            <circle cx="30" cy="30" r="6" fill={accentColor} />
            <circle cx="70" cy="30" r="6" fill={accentColor} /> 
          </svg>
        );
      case 4:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="90" height="90" rx="20" fill={baseColor} />
            <circle cx="50" cy="40" r="22" fill="white" />
            <rect x="20" y="60" width="60" height="30" rx="15" fill="white" />
            <path d="M40 30 L50 20 L60 30" stroke={accentColor} strokeWidth="3" fill="none" /> 
            <circle cx="30" cy="30" r="7" fill={accentColor} />
            <circle cx="70" cy="30" r="7" fill={accentColor} />
          </svg>
        );
      case 5:
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50 5, 95 40, 80 95, 20 95, 5 40" fill={baseColor} /> 
            <circle cx="50" cy="40" r="25" fill="white" />
            <rect x="15" y="60" width="70" height="35" rx="17.5" fill="white" />
            <path d="M30 30 L50 10 L70 30" stroke={accentColor} strokeWidth="4" fill="none" />
            <path d="M20 50 L80 50" stroke={accentColor} strokeWidth="4" fill="none" />
            <circle cx="30" cy="30" r="8" fill={accentColor} />
            <circle cx="70" cy="30" r="8" fill={accentColor} />
          </svg>
        );
      default:
        // Podrazumevani avatar za nivo 1 ili ako nivo nije definisan
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill={baseColor} />
            <circle cx="50" cy="40" r="15" fill="white" />
            <rect x="35" y="60" width="30" height="15" rx="7.5" fill="white" />
          </svg>
        );
    }
  };

  return (
    <Box sx={{
      width: 160, 
      height: 160, 
      borderRadius: '50%',
      overflow: 'hidden',
      border: `4px solid ${theme.palette.secondary.main}`,
      boxShadow: `0px 0px 0px 8px rgba(187, 134, 252, 0.2), 0px 0px 30px rgba(187, 134, 252, 0.4)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 2,
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: `0px 0px 0px 10px rgba(187, 134, 252, 0.3), 0px 0px 40px rgba(187, 134, 252, 0.6)`,
      },
    }}>
      {getAvatarSvg(level)} 
    </Box>
  );
};

export default AvatarDisplay;
