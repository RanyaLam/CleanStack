import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Box } from '@mui/material';
import { styled } from '@mui/system';

const DashboardTableContainer = styled(TableContainer)({
    width: '90%',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: 'transparent',
});

const DashboardTable = styled(Table)({
    minWidth: 700,
});

const DashboardTableHead = styled(TableHead)({
    backgroundColor: 'transparent',
});

const DashboardHeaderCell = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '1em',
    padding: '12px 16px',
    color: '#013D5B',
    borderBottom: '2px solid #F0C808',
});

const DashboardTableRow = styled(TableRow)({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
        backgroundColor: '#f9f9f9',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

const DashboardTableCell = styled(TableCell)({
    padding: '12px 16px',
    fontSize: '0.9em',
    color: '#333',
    borderBottom: '1px solid #e0e0e0',
});

const NoDemandsText = styled(Typography)({
    color: '#013D5B',
    textAlign: 'center',
    marginTop: '20px',
    fontStyle: 'italic',
});

const Demande = () => {
    const [demandes, setDemandes] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openContactModal, setOpenContactModal] = useState(false);
    const [clientDetails, setClientDetails] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


    useEffect(() => {
        const clientId = localStorage.getItem('clientId');
        if (clientId) {
            fetch(`http://localhost:3080/api/offers?clientId=${clientId}`)
                .then(response => response.json())
                .then(data => setDemandes(data))
                .catch(error => console.error('Error fetching demandes:', error));
        } else {
            console.error('Client ID not found in local storage');
        }
    }, []);


    const handleOpenModal = (job) => {
        setSelectedJob(job);
        setOpenModal(true);
    };

    const handleContactCleaner = (cleanerId) => {
        fetch(`http://localhost:3080/api/cleaners/${cleanerId}/contact`)
            .then(response => response.json())
            .then(data => {
                setClientDetails(data);
                setOpenContactModal(true);
            })
            .catch(error => {
                console.error('Error fetching cleaner contact details:', error);
            });
    };



    const handleCloseModal = () => {
        setOpenModal(false);
        setRating(0);
        setReview('');
        setSelectedJob(null);
    };


    const handleCloseContactModal = () => {
        setOpenContactModal(false);
        setClientDetails(null);
    };


    const handleSubmitReview = () => {
        const clientId = localStorage.getItem('clientId');
        const cleanerId = selectedJob.cleaner_id;

        if (rating === 0 || review === '') {
            setErrorMessage('Please provide a rating and write a review.');
            return;
        }

        fetch('http://localhost:3080/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ client_id: clientId, cleaner_id: cleanerId, review_text: review, rating }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSuccessMessage('Review submitted successfully');
                    handleCloseModal();
                } else {
                    setErrorMessage('Failed to submit review');
                }
            })
            .catch(error => {
                setErrorMessage('Server error, please try again later.');
            });
    };



    return (
        <DashboardTableContainer>
            <Typography variant="h5" align="center" style={{ marginBottom: '30px', fontWeight: 'bold', color: '#013D5B' }}>
                Mes Demandes
            </Typography>
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            {demandes.length === 0 ? (
                <NoDemandsText variant="body1">Aucune demande disponible.</NoDemandsText>
            ) : (
                <DashboardTable>
                    <DashboardTableHead>
                        <TableRow>
                            <DashboardHeaderCell>ID</DashboardHeaderCell>
                            <DashboardHeaderCell>ID du Nettoyeur</DashboardHeaderCell>
                            <DashboardHeaderCell>Prix</DashboardHeaderCell>
                            <DashboardHeaderCell>Description</DashboardHeaderCell>
                            <DashboardHeaderCell>Statut</DashboardHeaderCell>
                            <DashboardHeaderCell>Date de Décision</DashboardHeaderCell>
                            <DashboardHeaderCell>Actions</DashboardHeaderCell>
                        </TableRow>
                    </DashboardTableHead>
                    <TableBody>
                        {demandes.map((demande) => (
                            <DashboardTableRow key={demande.id}>
                                <DashboardTableCell>{demande.id}</DashboardTableCell>
                                <DashboardTableCell>{demande.cleaner_id}</DashboardTableCell>
                                <DashboardTableCell>{demande.price} €</DashboardTableCell>
                                <DashboardTableCell>{demande.description}</DashboardTableCell>
                                <DashboardTableCell>{demande.status}</DashboardTableCell>
                                <DashboardTableCell>{demande.decision_date}</DashboardTableCell>
                                <DashboardTableCell>
                                    {demande.status === 'completed' && (
                                        <Button variant="outlined" onClick={() => handleOpenModal(demande)}>
                                            Laisser un Avis
                                        </Button>
                                    )}
                                    {demande.status === 'in-progress' && (
                                        <Button variant="outlined" onClick={() => handleContactCleaner(demande.cleaner_id)}>
                                            Contacter le Nettoyeur
                                        </Button>
                                    )}

                                </DashboardTableCell>
                            </DashboardTableRow>
                        ))}
                    </TableBody>
                </DashboardTable>
            )}


            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Laisser un Avis</DialogTitle>
                <DialogContent>
                    <Typography>Job: {selectedJob?.description}</Typography>
                    <Typography>Cleaner: {selectedJob?.cleaner_id}</Typography>

                    <Box style={{ marginTop: '20px' }}>
                        <Typography component="legend">Rating</Typography>
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                        />
                    </Box>

                    <TextField
                        label="Votre Avis"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        style={{ marginTop: '20px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleSubmitReview} color="primary">
                        Envoyer
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openContactModal} onClose={handleCloseContactModal}>
                <DialogTitle>Contacter le Nettoyeur</DialogTitle>
                <DialogContent>
                    {clientDetails ? (
                        <>
                            <Typography>Nom: {clientDetails.name}</Typography>
                            <Typography>Téléphone: {clientDetails.phone}</Typography>
                            <Typography>Email: {clientDetails.email}</Typography>
                        </>
                    ) : (
                        <Typography>Chargement des détails du nettoyeur...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseContactModal} color="primary">Fermer</Button>
                </DialogActions>
            </Dialog>
        </DashboardTableContainer>
    );
};

export default Demande;










