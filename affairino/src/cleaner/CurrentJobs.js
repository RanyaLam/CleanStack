import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';

const JobsContainer = styled(TableContainer)({
    width: '90%',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const StyledTable = styled(Table)({
    minWidth: 700,
    fontFamily: 'Inter, sans-serif',
    color: '#013D5B',
});

const TableHeaderCell = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '1em',
    padding: '12px 16px',
    color: '#013D5B',
    borderBottom: '2px solid #F0C808',
});

const TableDataCell = styled(TableCell)({
    padding: '12px 16px',
    fontSize: '0.9em',
    color: '#333',
    borderBottom: '1px solid #e0e0e0',
});

const StyledTableRow = styled(TableRow)({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
        backgroundColor: '#f9f9f9',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

const FinishButton = styled(Button)({
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '24px',
    padding: '8px 16px',
    marginLeft: '8px',
    '&:hover': {
        backgroundColor: '#388e3c',
    },
});

const ContactButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: 'white',
    borderRadius: '24px',
    padding: '8px 16px',
    marginLeft: '8px',
    '&:hover': {
        backgroundColor: '#4f6a4f',
    },
});

const CurrentJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [openContactDialog, setOpenContactDialog] = useState(false);

    useEffect(() => {
        const cleanerId = localStorage.getItem('cleanerId');
        if (cleanerId) {
            fetch(`http://localhost:3080/api/offers/current-jobs?cleanerId=${cleanerId}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setJobs(data);
                    } else {
                        setError('Failed to fetch current jobs');
                    }
                })
                .catch(error => {
                    console.error('Error fetching current jobs:', error);
                    setError('Error fetching current jobs');
                });
        } else {
            setError('Cleaner ID not found');
        }
    }, []);


    const handleFinish = (id) => {
        fetch('http://localhost:3080/api/offers/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
                } else {
                    alert('Failed to mark job as completed');
                }
            })
            .catch(error => console.error('Error marking job as completed:', error));
    };


    const handleContactClick = (clientId) => {
        fetch(`http://localhost:3080/api/clients/${clientId}`)
            .then(response => response.json())
            .then(data => {
                setClientDetails(data);
                setOpenContactDialog(true);
            })
            .catch(error => console.error('Error fetching client details:', error));
    };

    const handleContactClose = () => {
        setOpenContactDialog(false);
        setClientDetails(null);
    };

    return (
        <JobsContainer component={Paper}>
            <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '20px', fontWeight: 'bold', color: '#013D5B' }}>
                Current Jobs
            </Typography>
            {error ? (
                <Typography variant="body1" color="error" align="center">{error}</Typography>
            ) : (
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>Prix</TableHeaderCell>
                            <TableHeaderCell>Description</TableHeaderCell>
                            <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job) => (
                            <StyledTableRow key={job.id}>
                                <TableDataCell>{job.id}</TableDataCell>
                                <TableDataCell>{job.price} €</TableDataCell>
                                <TableDataCell>{job.description}</TableDataCell>
                                <TableDataCell>
                                    <FinishButton onClick={() => handleFinish(job.id)}>
                                        Terminer
                                    </FinishButton>
                                    <ContactButton onClick={() => handleContactClick(job.clientId)}>
                                        Contacter le Client
                                    </ContactButton>
                                </TableDataCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            )}


            <Dialog open={openContactDialog} onClose={handleContactClose}>
                <DialogTitle>Contacter le Client</DialogTitle>
                <DialogContent>
                    {clientDetails ? (
                        <>
                            <DialogContentText>Nom: {clientDetails.name}</DialogContentText>
                            <DialogContentText>Téléphone: {clientDetails.phone}</DialogContentText>
                            <DialogContentText>Email: {clientDetails.email}</DialogContentText>
                        </>
                    ) : (
                        <DialogContentText>Chargement des détails du client...</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleContactClose} color="primary">Fermer</Button>
                </DialogActions>
            </Dialog>
        </JobsContainer>
    );
};

export default CurrentJobs;
