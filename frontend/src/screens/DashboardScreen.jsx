// frontend/src/screens/DashboardScreen.jsx
// Programer: Andrija Vulešević
// Datum: 12.05.2025.
// Svrha: Glavni dashboard za prijavljenog korisnika, prikazuje XP, Avatar, Misije, Statistiku, Značke i Podsetnike sa savršenim poravnanjem koristeći Flexbox.

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Container, Snackbar, List, ListItem, ListItemText, Button } from '@mui/material'; 
import MuiAlert from '@mui/material/Alert';
import XPBar from '../components/XPBar';
import AvatarDisplay from '../components/AvatarDisplay';
import MissionCard from '../components/MissionCard';
import StatsDashboard from '../components/StatsDashboard';
import BadgeDisplay from '../components/BadgeDisplay';
import axios from 'axios';
import { format, parseISO, isFuture, isPast, differenceInMinutes } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const DashboardScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [missions, setMissions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifiedReminderIds, setNotifiedReminderIds] = useState([]);
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const fetchUserData = useCallback(async () => {
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

      const { data: userData } = await axios.get('http://localhost:5000/api/user/profile', config);
      const xpRequiredForCurrentLevel = userData.level * 100;
      setUserInfo({ ...userData, xpToNextLevel: xpRequiredForCurrentLevel });

      const { data: missionsData } = await axios.get('http://localhost:5000/api/missions', config);
      const processedMissions = missionsData.map(mission => ({
          ...mission,
          isCompleted: mission.completedBy.includes(userData._id)
      }));
      setMissions(processedMissions);

      const { data: diaryData } = await axios.get('http://localhost:5000/api/diary', config);
      setDiaryEntries(diaryData);

      const { data: remindersData } = await axios.get('http://localhost:5000/api/reminders', config);
      const upcomingReminders = remindersData.filter(r => isFuture(parseISO(r.dateTime)) && !r.isCompleted);
      setReminders(upcomingReminders);

      try {
        const { data: activitiesData } = await axios.get('http://localhost:5000/api/activities', config);
        setActivities(activitiesData);
      } catch (activityErr) {
        console.warn("Nije moguće dohvatiti aktivnosti. Ruta /api/activities možda ne postoji ili je prazna.", activityErr);
        setActivities([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Greška pri dohvatanju podataka:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Došlo je do greške pri dohvatanju podataka.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const reminderCheckInterval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = parseISO(reminder.dateTime);
        if (isPast(reminderTime) && differenceInMinutes(now, reminderTime) <= 1 && !notifiedReminderIds.includes(reminder._id) && !reminder.isCompleted) {
          setSnackbarMessage(`PODSETNIK: ${reminder.title} - ${reminder.description || 'Vreme je za vežbanje!'}`);
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
          setNotifiedReminderIds(prevIds => [...prevIds, reminder._id]);
        }
      });
    }, 30000);

    return () => clearInterval(reminderCheckInterval);
  }, [reminders, notifiedReminderIds]);

  const handleCompleteMission = async (missionId) => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      const { data } = await axios.post(`http://localhost:5000/api/missions/complete/${missionId}`, {}, config);

      setMissions(prevMissions =>
        prevMissions.map(mission =>
          mission._id === missionId ? { ...mission, isCompleted: true } : mission
        )
      );

      setUserInfo(prevInfo => ({
        ...prevInfo,
        xp: data.userXp,
        level: data.userLevel,
        xpToNextLevel: data.xpToNextLevel,
        badges: data.newlyAwardedBadges ? [...(prevInfo.badges || []), ...data.newlyAwardedBadges] : prevInfo.badges
      }));

      if (data.newlyAwardedBadges && data.newlyAwardedBadges.length > 0) {
        const badgeNames = data.newlyAwardedBadges.map(b => b.name).join(', ');
        setSnackbarMessage(`Čestitamo! Osvojili ste značke: ${badgeNames}!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(`Misija kompletirana! Dobili ste ${data.xpGained} XP.`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }

      if (data.userLevel > data.userLevelBefore) {
        setSnackbarMessage(`Čestitamo! Dostigli ste NIVO ${data.userLevel}!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }

    } catch (err) {
      console.error("Greška pri kompletiranju misije:", err);
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri kompletiranju misije.';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleResetDailyMissions = async () => {
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

      const { data } = await axios.post('http://localhost:5000/api/missions/reset-daily', {}, config);
      setSnackbarMessage(data.message || 'Dnevne misije resetovane!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUserData(); 
    } catch (err) {
      console.error("Greška pri resetovanju dnevnih misija:", err);
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri resetovanju dnevnih misija.';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
        <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>Učitavanje podataka...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: { xs: 3, md: 5 }, color: theme.palette.primary.light }}>
        Moj Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 4 } }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleResetDailyMissions}
          sx={{ py: 1.5, px: 3, fontSize: '1rem', fontWeight: 'bold', borderRadius: '12px' }}
        >
          Resetuj Dnevne Misije
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 4 },
      }}>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          alignItems: 'stretch',
        }}>

          <Box sx={{
            flex: { xs: '1 1 100%', md: '0 0 33.33%' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              minHeight: '300px',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              {userInfo && <AvatarDisplay level={userInfo.level || 1} />}
              <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {userInfo && <XPBar
                  currentXp={userInfo.xp || 0}
                  level={userInfo.level || 1}
                  xpToNextLevel={userInfo.xpToNextLevel || 100}
                />}
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.light }}>
                    Nivo: {userInfo?.level || 1}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    XP: {userInfo?.xp || 0}/{userInfo?.xpToNextLevel || 100}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 66.66%' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '300px',
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
                Dostupne Misije
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start' }}>
                {missions.length > 0 ? (
                  missions.map((mission) => (
                    <Box key={mission._id} sx={{ flex: '0 0 calc(33.33% - 16px)', maxWidth: 'calc(33.33% - 16px)',
                                                  '@media (max-width:900px)': { flex: '0 0 calc(50% - 16px)', maxWidth: 'calc(50% - 16px)' },
                                                  '@media (max-width:600px)': { flex: '1 1 100%', maxWidth: '100%' }
                                                }}>
                      <MissionCard mission={mission} onCompleteMission={handleCompleteMission} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ ml: { xs: 1, md: 2 } }}>
                    Nema dostupnih misija.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          alignItems: 'stretch',
        }}>
          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '250px',
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 }, textAlign: 'center' }}>
                Osvojene Značke
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
                {userInfo?.badges && userInfo.badges.length > 0 ? (
                  userInfo.badges.map((badge) => (
                    typeof badge === 'object' && badge !== null && badge._id ? (
                      <BadgeDisplay key={badge._id} badge={badge} />
                    ) : (
                      <Typography key={badge} variant="caption" sx={{ m: 1, color: theme.palette.text.secondary }}>Značka ID: {badge}</Typography>
                    )
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Još uvek nema osvojenih znački. Završite misije!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>

          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '250px',
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 }, textAlign: 'center' }}>
                Nadolazeći Podsetnici
              </Typography>
              {reminders.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {reminders.slice(0, 3).map((reminder) => (
                    <ListItem key={reminder._id} divider sx={{ mb: 1, borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', '&:last-child': { mb: 0 } }}>
                      <ListItemText
                        primary={<Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>{reminder.title}</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{format(parseISO(reminder.dateTime), 'dd.MM.yyyy. HH:mm')}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Nema nadolazećih podsetnika. Kreirajte ih u sekciji "Podsetnici"!
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <StatsDashboard userData={userInfo} activities={activities || []} diaryEntries={diaryEntries || []} />
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '8px', background: theme.palette.background.paper, color: theme.palette.text.primary }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default DashboardScreen;
