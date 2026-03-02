// frontend/src/screens/DiaryScreen.jsx
// Programer: Andrija Vulešević
// Datum: 13.05.2025.
// Svrha: Stranica za upravljanje dnevnikom aktivnosti i osećanja sa modernim tamnim dizajnom.

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

const API_BASE_URL = 'http://localhost:5000/api'; 

// Pomoćna komponenta za prikaz pojedinačnog unosa u dnevnik
const DiaryEntryItem = ({ entry, onEdit, onDelete }) => {
    const theme = useTheme(); 
   
    const formattedDate = format(parseISO(entry.date), 'dd.MM.yyyy. HH:mm');

    // Boja raspoloženja
    let moodColor = theme.palette.text.secondary;
    switch (entry.mood) { 
        case 'Odlično': moodColor = theme.palette.success.main; break; 
        case 'Dobro': moodColor = theme.palette.secondary.main; break; 
        case 'Neutralno': moodColor = theme.palette.info.main; break; 
        case 'Loše': moodColor = theme.palette.warning.main; break; 
        case 'Užasno': moodColor = theme.palette.error.main; break; 
        default: moodColor = theme.palette.text.secondary;
    }

    return (
        <ListItem divider sx={{
            mb: 1,
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            '&:last-child': { mb: 0 },
            alignItems: 'flex-start',
            p: { xs: 1.5, md: 2 }
        }}>
            <ListItemText
                primary={
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.palette.primary.light }}>
                        {entry.title}
                    </Typography>
                }
                secondary={
                    <>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Datum: {formattedDate}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ display: 'block', color: moodColor, fontWeight: 'bold', mb: 0.5 }}>
                            Raspoloženje: {entry.mood}
                        </Typography>
                        {entry.notes && ( 
                            <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                                Beleške: {entry.notes}
                            </Typography>
                        )}
                    </>
                }
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(entry)} sx={{ color: theme.palette.secondary.light }}>
                    <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(entry._id)} sx={{ color: theme.palette.error.main }}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const DiaryScreen = () => {
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [mood, setMood] = useState('');
    const [date, setDate] = useState(''); 

    const moodOptions = ['Odlično', 'Dobro', 'Neutralno', 'Loše', 'Užasno'];

    // Dohvatanje unosa iz dnevnika
    const fetchDiaryEntries = async () => {
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

            const { data } = await axios.get(`${API_BASE_URL}/diary`, config);
            setDiaryEntries(data);
            setLoading(false);
        } catch (err) {
            console.error("Greška pri dohvatanju unosa iz dnevnika:", err);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Došlo je do greške pri dohvatanju unosa iz dnevnika.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiaryEntries();
    }, []);

    const handleOpenDialog = (entry = null) => {
        setCurrentEntry(entry);
        if (entry) {
            setTitle(entry.title);
            setNotes(entry.notes || '');
            setMood(entry.mood || '');
            setDate(format(parseISO(entry.date), "yyyy-MM-dd'T'HH:mm"));
        } else {
            setTitle('');
            setNotes('');
            setMood('');
            setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
        }
        setOpenDialog(true);
        setError(''); 
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEntry(null);
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSnackbarMessage('');
        setSnackbarSeverity('success');

       
        if (!title || !mood || !date) {
            setError('Molimo unesite naslov, raspoloženje i datum/vreme.');
            setSnackbarSeverity('error');
            setSnackbarMessage('Niste popunili sva obavezna polja.');
            setSnackbarOpen(true);
            return;
        }

        try {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUserInfo.token}`,
                },
            };

            const entryData = {
                title,
                notes,
                mood,
                date: new Date(date).toISOString(), 
            };
            
            console.log("[FRONTEND-DEBUG] Sending data:", entryData); 

            if (currentEntry) {
                const { data } = await axios.put(`${API_BASE_URL}/diary/${currentEntry._id}`, entryData, config);
                setDiaryEntries(diaryEntries.map(e => (e._id === data._id ? data : e)));
                setSnackbarMessage('Unos u dnevnik uspešno ažuriran!');
            } else {
                const { data } = await axios.post(`${API_BASE_URL}/diary`, entryData, config);
                setDiaryEntries([data, ...diaryEntries]);
                setSnackbarMessage('Unos u dnevnik uspešno kreiran!');
            }
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseDialog();
        } catch (err) {
            console.error("Greška pri čuvanju unosa u dnevnik:", err.response ? err.response.data : err);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Greška pri čuvanju unosa u dnevnik.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id) => {
     
        if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj unos?')) {
            return;
        }

        try {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${storedUserInfo.token}`,
                },
            };
            await axios.delete(`${API_BASE_URL}/diary/${id}`, config);
            setDiaryEntries(diaryEntries.filter(e => e._id !== id));
            setSnackbarMessage('Unos u dnevnik uspešno obrisan!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Greška pri brisanju unosa iz dnevnika:", err);
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Greška pri brisanju unosa iz dnevnika.');
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
                <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.primary }}>Učitavanje dnevnika...</Typography>
            </Box>
        );
    }



    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: { xs: 3, md: 5 }, color: theme.palette.primary.light }}>
                Moj Dnevnik
            </Typography>

            <Paper elevation={6} sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                borderRadius: '16px', 
                background: theme.palette.background.paper, 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', 
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            py: { xs: 1, md: 1.2 },
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                            }
                        }}
                    >
                        Dodaj Unos
                    </Button>
                </Box>

                <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
                    Svi Unosi
                </Typography>
                {diaryEntries.length > 0 ? (
                    <List sx={{ '.MuiListItem-divider': { borderColor: 'rgba(255,255,255,0.1)' } }}> 
                        {diaryEntries.map((entry) => (
                            <DiaryEntryItem
                                key={entry._id}
                                entry={entry}
                                onEdit={handleOpenDialog}
                                onDelete={handleDelete}
                            />
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Nema zabeleženih unosa u dnevnik. Kliknite "Dodaj Unos" da kreirate prvi!
                    </Typography>
                )}
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: theme.palette.background.paper,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    color: theme.palette.text.primary, 
                }
            }}>
                <DialogTitle sx={{ color: theme.palette.primary.light, fontWeight: 'bold' }}>{currentEntry ? 'Uredi Unos' : 'Dodaj Novi Unos'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ my: 2, borderRadius: '8px' }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="dense"
                            label="Naslov Unosa"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.primary.main } },
                                '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Beleške (opciono)"
                            type="text"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.primary.main } },
                                '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                        />
                        <TextField
                            select
                            margin="dense"
                            label="Raspoloženje"
                            fullWidth
                            variant="outlined"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            required
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.primary.main } },
                                '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                        >
                            {moodOptions.map((option) => (
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
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.primary.main } },
                                '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                '& .MuiInputBase-input': { color: theme.palette.text.primary },
                            }}
                        />
                        <DialogActions sx={{ px: 0, pt: 2 }}>
                            <Button onClick={handleCloseDialog} color="secondary" sx={{ py: 1, px: 2, borderRadius: '8px' }}>
                                Otkaži
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ py: 1, px: 2, borderRadius: '8px' }}>
                                {currentEntry ? 'Sačuvaj Promene' : 'Kreiraj Unos'}
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
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{
                    width: '100%',
                    borderRadius: '8px',
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary
                }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DiaryScreen;
