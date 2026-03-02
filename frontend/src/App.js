// frontend/src/App.js
// Programer: Nikša Halas
// Datum: 13.05.2025.
// Svrha: Glavna komponenta aplikacije sa rutiranjem i globalnim temiranjem (Tamna, Moderna Tema).

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';


import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiaryScreen from './screens/DiaryScreen';
import ReminderScreen from './screens/ReminderScreen';
import ActivityScreen from './screens/ActivityScreen';
import PrivateRoute from './components/hoc/PrivateRoute';


const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#BB86FC', 
      light: '#D0A0FF',
      dark: '#8A2BE2', 
      contrastText: '#000', 
    },
    secondary: {
      main: '#03DAC6', 
      light: '#66FCF1',
      dark: '#00BFFF', 
      contrastText: '#000',
    },
    background: {
      default: '#121212', 
      paper: '#1E1E1E', 
    },
    text: {
      primary: '#E0E0E0', 
      secondary: '#B0B0B0', 
    },
   
    darkBlue: {
      main: '#1A1A2E', 
    },
    darkPurple: {
      main: '#2C2C4A', 
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: {
      fontWeight: 700, 
      fontSize: '2.4rem',
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.6rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.3rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#E0E0E0', 
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#B0B0B0',
    },
    button: {
      textTransform: 'none', 
      fontWeight: 600,
      letterSpacing: '0.02em', 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', 
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', 
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 25px rgba(0, 0, 0, 0.4)',
          },
        },
        containedPrimary: {
          
          background: 'linear-gradient(45deg, #BB86FC 30%, #8A2BE2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #D0A0FF 30%, #BB86FC 90%)',
          },
        },
        containedSecondary: {
       
          background: 'linear-gradient(45deg, #03DAC6 30%, #00BFFF 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #66FCF1 30%, #03DAC6 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px', 
          background: 'rgba(30, 30, 30, 0.8)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', 
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1) !important',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3) !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#BB86FC !important',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0', 
          },
          '& .MuiInputBase-input': {
            color: '#E0E0E0', 
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1A1A2E 0%, #2C2C4A 100%)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', 
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          marginBottom: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiTooltip: { 
      styleOverrides: {
        tooltip: {
          backgroundColor: '#333',
          color: '#fff',
          fontSize: '0.9rem',
          borderRadius: '8px',
          padding: '8px 12px',
        },
        arrow: {
          color: '#333',
        },
      },
    },
  },
});


const AppBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.darkBlue.main} 0%, ${theme.palette.darkPurple.main} 100%)`,
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary, 
}));


function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = localStorage.getItem('userInfo');
      setIsLoggedIn(!!userInfo);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <AppBackground> 
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
              Fitness Quest
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white' }}>
              Početna
            </Button>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard" sx={{ color: 'white' }}>
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/diary" sx={{ color: 'white' }}>
                  Dnevnik
                </Button>
                <Button color="inherit" component={Link} to="/reminders" sx={{ color: 'white' }}>
                  Podsetnici
                </Button>
                <Button color="inherit" component={Link} to="/activities" sx={{ color: 'white' }}>
                  Aktivnosti
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>
                  Odjava
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/register" sx={{ color: 'white' }}>
                  Registracija
                </Button>
                <Button color="inherit" component={Link} to="/login" sx={{ color: 'white' }}>
                  Prijava
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: { xs: 2, md: 4 } }}> 
          <Routes>
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/" element={
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'calc(100vh - 200px)', 
                  background: 'rgba(30, 30, 30, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.light, mb: 2 }}>
                  Dobrodošli u Fitness Quest!
                </Typography>
                <Typography variant="h6" component="p" sx={{ mb: { xs: 3, md: 4 }, color: theme.palette.text.secondary, maxWidth: '700px' }}>
                  Gejmifikovana platforma za vežbanje koja te motiviše da dostigneš svoje ciljeve kroz izazove, nagrade i praćenje napretka.
                </Typography>
                {!isLoggedIn && (
                  <Button variant="contained" color="primary" size="large" component={Link} to="/register" sx={{ px: { xs: 3, md: 5 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    Započni Avanturu!
                  </Button>
                )}
                {isLoggedIn && (
                  <Button variant="contained" color="primary" size="large" component={Link} to="/dashboard" sx={{ px: { xs: 3, md: 5 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    Idi na Dashboard!
                  </Button>
                )}
              </Paper>
            } />
            {/* Zaštićene rute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/diary"
              element={
                <PrivateRoute>
                  <DiaryScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <PrivateRoute>
                  <ReminderScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivityScreen />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </AppBackground>
    </ThemeProvider>
  );
}

export default App;
