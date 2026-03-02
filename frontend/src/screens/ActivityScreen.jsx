// frontend/src/screens/ActivityScreen.jsx
// Programer: Andrija Vulešević
// Datum: 12.05.2025.
// Svrha: Stranica za upravljanje fizičkim aktivnostima korisnika sa modernim tamnim dizajnom.


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
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';


const ActivityItem = ({ activity, onEdit, onDelete }) => {
  const theme = useTheme();
  const formattedDate = format(parseISO(activity.date), 'dd.MM.yyyy. HH:mm');

  return (
    <ListItem divider sx={{
      mb: 1.5, 
      borderRadius: '12px', 
      backgroundColor: 'rgba(255,255,255,0.05)', 
      border: '1px solid rgba(255,255,255,0.08)', 
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.08)',
        transform: 'translateY(-2px)', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      },
      '&:last-child': { mb: 0 },
      alignItems: 'flex-start',
      p: { xs: 1.5, md: 2 }
    }}>
      <ListItemText
        primary={
          <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.palette.primary.light }}>
            {activity.name} ({activity.activityType})
          </Typography>
        }
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Trajanje: {activity.duration} min | Intenzitet: {activity.intensity}
              {activity.caloriesBurned && ` | Kalorije: ${activity.caloriesBurned}`}
            </Typography>
            <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
              Datum: {formattedDate}
            </Typography>
          </>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 1 } }}> 
        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(activity)} sx={{ color: theme.palette.primary.main }}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(activity._id)} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [name, setName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [intensity, setIntensity] = useState('');
  const [date, setDate] = useState('');

  const activityTypes = ['Kardio', 'Snaga', 'Fleksibilnost', 'Joga', 'Sport', 'Ostalo'];
  const intensities = ['Nizak', 'Srednji', 'Visok'];

  const fetchActivities = async () => {
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

      const { data } = await axios.get('http://localhost:5000/api/activities', config);
      setActivities(data);
      setLoading(false);
    } catch (err) {
      console.error("Greška pri dohvatanju aktivnosti:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Došlo je do greške pri dohvatanju aktivnosti.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleOpenDialog = (activity = null) => {
    setCurrentActivity(activity);
    if (activity) {
      setName(activity.name);
      setActivityType(activity.activityType);
      setDuration(activity.duration);
      setCaloriesBurned(activity.caloriesBurned || '');
      setIntensity(activity.intensity);
      setDate(format(parseISO(activity.date), "yyyy-MM-dd'T'HH:mm"));
    } else {
      setName('');
      setActivityType('');
      setDuration('');
      setCaloriesBurned('');
      setIntensity('');
      setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentActivity(null);
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

      const activityData = {
        name,
        activityType,
        duration: Number(duration),
        caloriesBurned: caloriesBurned ? Number(caloriesBurned) : undefined,
        intensity,
        date: new Date(date),
      };

      if (currentActivity) {
        const { data } = await axios.put(`http://localhost:5000/api/activities/${currentActivity._id}`, activityData, config);
        setActivities(activities.map(a => (a._id === data._id ? data : a)));
        setSnackbarMessage('Aktivnost uspešno ažurirana!');
      } else {
        const { data } = await axios.post('http://localhost:5000/api/activities', activityData, config);
        setActivities([data, ...activities]);
        setSnackbarMessage('Aktivnost uspešno kreirana!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      console.error("Greška pri čuvanju aktivnosti:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri čuvanju aktivnosti.');
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
      await axios.delete(`http://localhost:5000/api/activities/${id}`, config);
      setActivities(activities.filter(a => a._id !== id));
      setSnackbarMessage('Aktivnost uspešno obrisana!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Greška pri brisanju aktivnosti:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri brisanju aktivnosti.');
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
        <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.primary }}>Učitavanje aktivnosti...</Typography>
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
        Moje Aktivnosti
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
            Dodaj Aktivnost
          </Button>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
          Sve Aktivnosti
        </Typography>
        {activities.length > 0 ? (
          <List>
            {activities.map((activity) => (
              <ActivityItem
                key={activity._id}
                activity={activity}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
              />
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nema zabeleženih aktivnosti. Kliknite "Dodaj Aktivnost" da kreirate prvu!
          </Typography>
        )}
      </Paper>

  
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: '16px', background: theme.palette.background.paper, border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' } }}>
        <DialogTitle sx={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>{currentActivity ? 'Uredi Aktivnost' : 'Dodaj Novu Aktivnost'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ my: 2, borderRadius: '8px' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Naziv Aktivnosti"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Tip Aktivnosti"
              fullWidth
              variant="outlined"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              required
              sx={{ mb: 2 }}
            >
              {activityTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Trajanje (minuta)"
              type="number"
              fullWidth
              variant="outlined"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              inputProps={{ min: 1 }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Kalorije (opciono)"
              type="number"
              fullWidth
              variant="outlined"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Intenzitet"
              fullWidth
              variant="outlined"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              required
              sx={{ mb: 2 }}
            >
              {intensities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Datum i Vreme"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />
            <DialogActions sx={{ px: 0, pt: 2 }}>
              <Button onClick={handleCloseDialog} color="secondary" sx={{ py: 1, px: 2 }}>
                Otkaži
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ py: 1, px: 2 }}>
                {currentActivity ? 'Sačuvaj Promene' : 'Kreiraj Aktivnost'}
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

export default ActivityScreen;
