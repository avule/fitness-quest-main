// frontend/src/components/XPBar.jsx
// Programer: Andrija Vulešević
// Datum: 11.05.2025.
// Svrha: Prikazuje XP progres bar i nivo korisnika sa modernim dizajnom.

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'; 

// Stilovi za progres bar
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12, 
  borderRadius: 6, 
  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    // Gradijent za progres bar
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    transition: 'width 0.5s ease-in-out', 
  },
}));

const XPBar = ({ currentXp, level, xpToNextLevel }) => {
  const theme = useTheme(); 

  const progress = (currentXp / xpToNextLevel) * 100;

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 1, px: 2 }}> 
      <StyledLinearProgress variant="determinate" value={progress} /> 
    </Box>
  );
};

export default XPBar;
