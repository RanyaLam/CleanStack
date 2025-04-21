import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

const Background = styled('div')({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

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

const Profil = () => {
    const [client, setClient] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    useEffect(() => {
        const clientId = localStorage.getItem('clientId');
        if (clientId) {
            fetch(`http://localhost:3080/api/client/${clientId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setClient(data.client);
                    } else {
                        alert('Failed to fetch client data');
                    }
                })
                .catch(error => console.error('Error fetching client data:', error));
        } else {
            console.error('Client ID not found in local storage');
        }
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient({ ...client, [name]: value });
    };

    const handleUpdate = () => {
        fetch('http://localhost:3080/api/client/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Client information updated successfully');
                } else {
                    alert('Failed to update client information');
                }
            })
            .catch(error => console.error('Error updating client data:', error));
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
                            value={client.id}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Nom complet"
                            variant="outlined"
                            value={client.name}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Adresse e-mail"
                            name="email"
                            variant="outlined"
                            value={client.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Mot de passe"
                            name="password"
                            variant="outlined"
                            type="password"
                            value={client.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Numéro de téléphone"
                            name="phone"
                            variant="outlined"
                            value={client.phone}
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

export default Profil;
