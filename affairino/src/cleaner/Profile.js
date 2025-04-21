import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

const Background = styled('div')({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Soft gradient background
});

const ProfileContainer = styled('div')({
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const StyledTextField = styled(TextField)({
    '& label': {
        color: '#013D5B',
        fontFamily: 'Inter, sans-serif',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#1F2833',
        },
        '&:hover fieldset': {
            borderColor: '#F0C808',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#F0C808',
        },
    },
    marginBottom: '16px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
});

const UpdateButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: '#013D5B',
    padding: '12px 24px',
    borderRadius: '24px',
    marginTop: '20px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#F4A157',
    },
    textTransform: 'uppercase',
});

const Profile = () => {
    const [cleaner, setCleaner] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        price: ''
    });

    useEffect(() => {
        const cleanerId = localStorage.getItem('cleanerId');
        if (cleanerId) {
            fetch(`http://localhost:3080/api/cleaner/${cleanerId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setCleaner(data.cleaner);
                    } else {
                        alert('Failed to fetch cleaner data');
                    }
                })
                .catch(error => console.error('Error fetching cleaner data:', error));
        } else {
            console.error('Cleaner ID not found in local storage');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCleaner({ ...cleaner, [name]: value });
    };

    const handleUpdate = () => {
        fetch('http://localhost:3080/api/cleaner/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleaner),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cleaner information updated successfully');
                } else {
                    alert('Failed to update cleaner information');
                }
            })
            .catch(error => console.error('Error updating cleaner data:', error));
    };

    return (
        <Background>
            <ProfileContainer>
                <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                    Mettre à jour mes informations personnelles
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Identifiant"
                            variant="outlined"
                            value={cleaner.id}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Nom complet"
                            variant="outlined"
                            value={cleaner.name}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Adresse e-mail"
                            name="email"
                            variant="outlined"
                            value={cleaner.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Mot de passe"
                            name="password"
                            variant="outlined"
                            type="password"
                            value={cleaner.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Numéro de téléphone"
                            name="phone"
                            variant="outlined"
                            value={cleaner.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Ville"
                            variant="outlined"
                            value={cleaner.city}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Prix par heure"
                            name="price"
                            variant="outlined"
                            value={cleaner.price}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UpdateButton onClick={handleUpdate}>Mettre à jour</UpdateButton>
                    </Grid>
                </Grid>
            </ProfileContainer>
        </Background>
    );
};

export default Profile;
