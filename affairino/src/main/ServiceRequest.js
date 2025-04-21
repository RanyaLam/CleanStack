
import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';

const ServicePaper = styled(Paper)({
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '32px auto',
});

function ServiceRequest({ onClose, onSubmit, cleanerId }) {
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const offerData = {
            price: parseFloat(price),
            description,
            cleaner_id: cleanerId
        };

        console.log('Offer data:', offerData);
        onSubmit(offerData);
    };

    return (
        <ServicePaper>
            <Typography variant="h5" color="#1F2833" fontWeight="bold" gutterBottom align="center">Demander un service</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} mb="16px">
                    <Grid item xs={12}>
                        <TextField
                            label="Negocier le prix de votre besoin"
                            variant="outlined"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description de votre besoin"
                            variant="outlined"
                            fullWidth
                            multiline rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: '#1F2833', color: 'white', borderRadius: '24px', padding: '12px 24px' }}
                        >
                            Envoyer
                        </Button>
                        <Button
                            onClick={onClose}
                            style={{ marginLeft: '16px', backgroundColor: '#f0c808', color: '#1F2833', borderRadius: '24px', padding: '12px 24px' }}
                        >
                            Annuler
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </ServicePaper>
    );
}

export default ServiceRequest;

