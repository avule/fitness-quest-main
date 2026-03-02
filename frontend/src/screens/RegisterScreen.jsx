// frontend/src/screens/RegisterScreen.jsx
// Programer: Andrija Vulešević
// Datum: 13.05.2025.
// Svrha: Stranica za registraciju korisnika sa modernim tamnim dizajnom.

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Alert, CircularProgress, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju!');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        { username, email, password },
        config
      );

      setSuccess('Registracija uspešna! Možete se sada prijaviti.');
    } catch (err) {
      console.error("Greška pri registraciji:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Neuspešna registracija. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, md: 5 }, 
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          background: theme.palette.background.paper, 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)', 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3, color: theme.palette.primary.light, fontWeight: 700 }}>
          Pridruži se Fitness Questu!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          Registrujte se i započnite svoju gejmifikovanu avanturu.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '8px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: '100%', borderRadius: '8px' }}>{success}</Alert>}
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><CircularProgress color="secondary" /></Box>}
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Korisničko Ime"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: { xs: 2, md: 3 } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresa"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: { xs: 2, md: 3 } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lozinka"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: { xs: 2, md: 3 } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Potvrdi Lozinku"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: { xs: 3, md: 4 } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2, py: { xs: 1.2, md: 1.5 }, fontSize: { xs: '1rem', md: '1.1rem' } }}
            disabled={loading}
          >
            Registruj se
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            Već imaš nalog? <Link to="/login" style={{ color: theme.palette.secondary.main, textDecoration: 'none', fontWeight: 'bold' }}>Prijavi se</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterScreen;
