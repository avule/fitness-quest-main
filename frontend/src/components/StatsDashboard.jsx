// frontend/src/components/StatsDashboard.jsx
// Programer: Andrija Vulešević
// Datum: 11.05.2025.
// Svrha: Prikazuje statistiku korisnika, XP progres, i grafove aktivnosti/raspoloženja sa savršenim poravnanjem.

import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';

// Funkcija za agregaciju aktivnosti po datumu
const aggregateActivitiesByDate = (activities) => {
  const dailyData = {};
  activities.forEach(activity => {
    const dateKey = format(parseISO(activity.date), 'dd.MM.');
    dailyData[dateKey] = (dailyData[dateKey] || 0) + activity.duration;
  });

  return Object.keys(dailyData).map(date => ({
    date,
    duration: dailyData[date]
  })).sort((a, b) => {
    const [dayA, monthA] = a.date.split('.').map(Number);
    const [dayB, monthB] = b.date.split('.').map(Number);
    if (monthA !== monthB) return monthA - monthB;
    return dayA - dayB;
  });
};

// Funkcija za agregaciju raspoloženja
const aggregateMoods = (diaryEntries) => {
  const moodCounts = {
    'Odlično': 0,
    'Dobro': 0,
    'Neutralno': 0,
    'Loše': 0,
    'Užasno': 0,
  };

  diaryEntries.forEach(entry => {
    if (moodCounts.hasOwnProperty(entry.mood)) {
      moodCounts[entry.mood]++;
    }
  });

  return Object.keys(moodCounts).map(mood => ({
    mood,
    count: moodCounts[mood]
  }));
};


const StatsDashboard = ({ userData, activities, diaryEntries }) => {
  const theme = useTheme();

  const activityData = aggregateActivitiesByDate(activities);
  const moodData = aggregateMoods(diaryEntries);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}> 
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
        Statistika Napretka
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, justifyContent: 'center', alignItems: 'stretch' }}> 
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 12px)', md: '0 0 calc(33.33% - 16px)' } }}> 
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Ukupno XP</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{userData?.xp || 0}</Typography>
          </Paper>
        </Box>

   
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 12px)', md: '0 0 calc(33.33% - 16px)' } }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Trenutni Nivo</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>{userData?.level || 1}</Typography>
          </Paper>
        </Box>

      
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 12px)', md: '0 0 calc(33.33% - 16px)' } }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Misije Kompletirane</Typography>
            <Typography variant="h4" sx={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>
              {userData?.completedMissionsCount || 0}
            </Typography>
          </Paper>
        </Box>

     
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, mb: 2 }}>
              Trajanje Aktivnosti po Danu (min)
            </Typography>
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '8px' }}
                    labelStyle={{ color: theme.palette.primary.main }}
                    itemStyle={{ color: theme.palette.text.primary }}
                  />
                  <Legend wrapperStyle={{ color: theme.palette.text.secondary, paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="duration" stroke={theme.palette.primary.main} strokeWidth={2} activeDot={{ r: 8 }} name="Trajanje (min)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Nema podataka o aktivnostima za prikaz grafa.
              </Typography>
            )}
          </Paper>
        </Box>


        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, mb: 2 }}>
              Raspoloženje
            </Typography>
            {moodData.length > 0 && moodData.some(m => m.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%"> 
                <BarChart data={moodData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mood" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.secondary.main}`, borderRadius: '8px' }}
                    labelStyle={{ color: theme.palette.secondary.main }}
                    itemStyle={{ color: theme.palette.text.primary }}
                  />
                  <Legend wrapperStyle={{ color: theme.palette.text.secondary, paddingTop: '10px' }} />
                  <Bar dataKey="count" fill={theme.palette.secondary.main} name="Broj unosa" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Nema podataka o raspoloženju za prikaz grafa.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsDashboard;
