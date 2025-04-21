import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Offersbackup = () => {
    const [offers, setOffers] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3080/api/admin/offers')
            .then(response => response.json())
            .then(data => setOffers(data))
            .catch(error => console.error('Error fetching offers:', error));
    }, []);


    return (
        <TableContainer component={Paper}>
            <Typography
                variant="h6"
                gutterBottom
                style={{ padding: '16px', textAlign: 'center' }}
            >
                Archive des Offres
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>ID du Nettoyeur</TableCell>
                        <TableCell>ID du Client</TableCell>
                        <TableCell>Prix</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Date de Décision</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(offers) && offers.length > 0 ? (
                        offers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell>{offer.id}</TableCell>
                                <TableCell>{offer.cleaner_id}</TableCell>
                                <TableCell>{offer.clientId}</TableCell>
                                <TableCell>{offer.price}</TableCell>
                                <TableCell>{offer.description}</TableCell>
                                <TableCell>{offer.status}</TableCell>
                                <TableCell>{new Date(offer.decision_date).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>Aucune offre trouvée</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

};

export default Offersbackup;


