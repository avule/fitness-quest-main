// frontend/src/screens/ReminderScreen.jsx
// Programer: Andrija Vulešević
// Datum: 13.05.2025.
// Svrha: Stranica za upravljanje podsetnicima (kreiranje, pregled, ažuriranje, brisanje) sa modernim tamnim dizajnom.

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const ReminderItem = ({ reminder, onEdit, onDelete, onToggleComplete }) => {
  const theme = useTheme();
  const formattedDateTime = format(parseISO(reminder.dateTime), 'dd.MM.yyyy. HH:mm');

  return (
    <ListItem divider sx={{
      mb: 1.5,
      borderRadius: '12px', 
      backgroundColor: reminder.isCompleted ? 'rgba(3, 218, 198, 0.08)' : 'rgba(255,255,255,0.05)', 
      border: `1px solid ${reminder.isCompleted ? theme.palette.secondary.main : 'rgba(255,255,255,0.08)'}`, 
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: reminder.isCompleted ? 'rgba(3, 218, 198, 0.12)' : 'rgba(255,255,255,0.08)',
        transform: 'translateY(-2px)', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      },
      '&:last-child': { mb: 0 },
      alignItems: 'flex-start',
      p: { xs: 1.5, md: 2 }
    }}>
      <ListItemText
        primary={
          <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.palette.primary.light, textDecoration: reminder.isCompleted ? 'line-through' : 'none' }}>
            {reminder.title}
          </Typography>
        }
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {formattedDateTime}
            </Typography>
            {reminder.description && (
              <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                {reminder.description}
              </Typography>
            )}
          </>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 1 } }}> 
        <IconButton edge="end" aria-label="toggle-complete" onClick={() => onToggleComplete(reminder._id, !reminder.isCompleted)} sx={{ color: reminder.isCompleted ? theme.palette.secondary.main : theme.palette.text.secondary }}>
          {reminder.isCompleted ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
        </IconButton>
        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(reminder)} sx={{ color: theme.palette.primary.main }}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(reminder._id)} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const ReminderScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(''); 

  const fetchReminders = async () => {
    setLoading(true);
    setError('');
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!storedUserInfo || !storedUserInfo.token) {
        setError('Niste prijavljeni. Molimo prijavite se.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/reminders', config);
      setReminders(data);
      setLoading(false);
    } catch (err) {
      console.error("Greška pri dohvatanju podsetnika:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Došlo je do greške pri dohvatanju podsetnika.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleOpenDialog = (reminder = null) => {
    setCurrentReminder(reminder);
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setDateTime(format(parseISO(reminder.dateTime), "yyyy-MM-dd'T'HH:mm"));
    } else {
      setTitle('');
      setDescription('');
      setDateTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentReminder(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSnackbarMessage('');
    setSnackbarSeverity('success');
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      const reminderData = { title, description, dateTime };

      if (currentReminder) {
        const { data } = await axios.put(`http://localhost:5000/api/reminders/${currentReminder._id}`, reminderData, config);
        setReminders(reminders.map(r => (r._id === data._id ? data : r)));
        setSnackbarMessage('Podsetnik uspešno ažuriran!');
      } else {
        const { data } = await axios.post('http://localhost:5000/api/reminders', reminderData, config);
        setReminders([data, ...reminders]);
        setSnackbarMessage('Podsetnik uspešno kreiran!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      console.error("Greška pri čuvanju podsetnika:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri čuvanju podsetnika.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/reminders/${id}`, config);
      setReminders(reminders.filter(r => r._id !== id));
      setSnackbarMessage('Podsetnik uspešno obrisan!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Greška pri brisanju podsetnika:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri brisanju podsetnika.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };
      const { data } = await axios.put(`http://localhost:5000/api/reminders/${id}`, { isCompleted }, config);
      setReminders(reminders.map(r => (r._id === data._id ? data : r)));
      setSnackbarMessage(`Podsetnik označen kao ${data.isCompleted ? 'kompletiran' : 'nekompletiran'}!`);
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Greška pri ažuriranju statusa podsetnika:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri ažuriranju statusa podsetnika.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.primary }}>Učitavanje podsetnika...</Typography>
      </Box>
    );
  }

  if (error && !snackbarOpen) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: { xs: 3, md: 5 }, color: theme.palette.primary.light }}>
        Moji Podsetnici
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ py: { xs: 1, md: 1.2 } }}
          >
            Dodaj Podsetnik
          </Button>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
          Lista Podsetnika
        </Typography>
        {reminders.length > 0 ? (
          <List>
            {reminders.map((reminder) => (
              <ReminderItem
                key={reminder._id}
                reminder={reminder}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nema podsetnika. Kliknite "Dodaj Podsetnik" da kreirate prvi!
          </Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: '16px', background: theme.palette.background.paper, border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' } }}>
        <DialogTitle sx={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>{currentReminder ? 'Uredi Podsetnik' : 'Dodaj Novi Podsetnik'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ my: 2, borderRadius: '8px' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Naslov Podsetnika"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Opis (opciono)"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Datum i Vreme"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />
            <DialogActions sx={{ px: 0, pt: 2 }}>
              <Button onClick={handleCloseDialog} color="secondary" sx={{ py: 1, px: 2 }}>
                Otkaži
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ py: 1, px: 2 }}>
                {currentReminder ? 'Sačuvaj Promene' : 'Kreiraj Podsetnik'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '8px', background: theme.palette.background.paper, color: theme.palette.text.primary }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReminderScreen;
