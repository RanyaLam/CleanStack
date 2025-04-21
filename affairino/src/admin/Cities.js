import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';

const AddButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: '#1F2833',
    borderRadius: '24px',
    padding: '12px 24px',
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: '#FFD700',
    },
    marginBottom: '16px',
});

const CitiesTable = styled(TableContainer)({
    marginTop: '16px',
    maxWidth: '1000px',
    margin: '0 auto',
});

const ActionButton = styled(Button)({
    color: 'white',
    '&:hover': {
        opacity: 0.8,
    },
    margin: '0 4px',
});

const FormContainer = styled(Paper)({
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginBottom: '16px',
});

const Cities = () => {
    const [cities, setCities] = useState([]);
    const [cityName, setCityName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/cities')
            .then(response => response.json())
            .then(data => setCities(data))
            .catch(error => console.error('Erreur lors de la récupération des villes:', error));
    }, []);


    const handleAddCity = () => {
        if (!cityName || !latitude || !longitude) {
            alert('Tous les champs sont obligatoires');
            return;
        }


        fetch('http://localhost:3080/api/admin/add-city', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: cityName, latitude, longitude }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCities([...cities, data.city]);
                    setCityName('');
                    setLatitude('');
                    setLongitude('');
                }
            })
            .catch(error => console.error('Erreur lors de l\'ajout de la ville:', error));
    };

    const [isEditing, setIsEditing] = useState(false);
    const [cityIdToEdit, setCityIdToEdit] = useState(null);


    const handleEditClick = (city) => {
        setCityName(city.name);
        setLatitude(city.latitude);
        setLongitude(city.longitude);
        setCityIdToEdit(city.id);
        setIsEditing(true);
    };


    const handleSaveCity = () => {
        if (!cityName || !latitude || !longitude) {
            alert('Tous les champs sont obligatoires');
            return;
        }


        if (isEditing) {
            fetch(`http://localhost:3080/api/admin/update-city/${cityIdToEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: cityName, latitude, longitude }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const updatedCities = cities.map(city =>
                            city.id === cityIdToEdit ? { ...city, name: cityName, latitude, longitude } : city
                        );
                        setCities(updatedCities);
                        setCityName('');
                        setLatitude('');
                        setLongitude('');
                        setCityIdToEdit(null);
                        setIsEditing(false);
                    }
                })
                .catch(error => console.error('Erreur lors de la mise à jour de la ville:', error));
        } else {
            handleAddCity();
        }
    };

    return (
        <Box p={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormContainer>
                        <Typography variant="h6">Informations sur la ville</Typography>
                        <TextField
                            label="Nom de la ville"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Typography variant="body2" color="textSecondary">
                            Sélectionnez Latitude & Longitude d'ici : <a href="https://www.mapcoordinates.net/en" target="_blank" rel="noopener noreferrer">https://www.mapcoordinates.net/en</a>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Veuillez entrer une Latitude & Longitude valides, sinon l'application pourrait ne pas fonctionner correctement.
                        </Typography>
                        <TextField
                            label="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <AddButton variant="contained" onClick={handleAddCity}>
                            Enregistrer
                        </AddButton>
                    </FormContainer>
                </Grid>
                <Grid item xs={12} md={8}>
                    <FormContainer>
                        <Typography variant="h6">Toutes les villes</Typography>
                        <CitiesTable component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom de la Ville</TableCell>
                                        <TableCell>Latitude</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cities.map((city) => (
                                        <TableRow key={city.id}>
                                            <TableCell>{city.name}</TableCell>
                                            <TableCell>{city.latitude}</TableCell>
                                            <TableCell>{city.longitude}</TableCell>
                                            <TableCell>
                                                <ActionButton
                                                    style={{ backgroundColor: '#2196f3' }}
                                                    variant="contained"
                                                    onClick={() => handleEditClick(city)}>
                                                    Modifier
                                                </ActionButton>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CitiesTable>
                    </FormContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cities;
