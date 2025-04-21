import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Paper, Typography, Button, Modal } from '@mui/material';
import ServiceRequest from '../main/ServiceRequest';




const TableContainer = styled(Paper)({
    width: '80%',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const StyledTable = styled('table')({
    width: '100%',
    textAlign: 'left',
    borderSpacing: '0 10px',
    borderCollapse: 'collapse',
    fontFamily: 'Inter, sans-serif',
    color: '#013D5B',
});

const TableHeader = styled('th')({
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '1.2em',
    borderBottom: '2px solid #F0C808',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const TableCell = styled('td')({
    padding: '10px',
    borderBottom: '1px solid #F0C808',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const TableRow = styled('tr')({
    borderBottom: '1px solid #F0C808',
    '&:hover': {
        backgroundColor: '#f1f1f1',
    },
});

const ActionButton = styled(Button)({
    backgroundColor: '#013D5B',
    color: 'white',
    borderRadius: '24px',
    padding: '10px 20px',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#0056b3',
    }
});

const ClientDashboard = () => {
    const [nearbyCleaners, setNearbyCleaners] = useState([]);
    const [showServiceRequest, setShowServiceRequest] = useState(false);
    const [offerDetails, setOfferDetails] = useState({ price: '', description: '', cleaner_id: '' });
    const [clientId, setClientId] = useState(localStorage.getItem('clientId'));

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchNearbyCleaners(latitude, longitude);
                },
                (error) => {
                    console.error('Error fetching location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const fetchNearbyCleaners = (latitude, longitude) => {
        fetch(`http://localhost:3080/api/cleaners/nearby?latitude=${latitude}&longitude=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
                setNearbyCleaners(data);
            })
            .catch((error) => console.error('Error fetching nearby cleaners:', error));
    };

    const handleSendOffer = (cleanerId) => {
        if (!clientId) {
            alert('Please log in to make a request.');
            return;
        }
        setOfferDetails({ price: '', description: '', cleaner_id: cleanerId });
        setShowServiceRequest(true);
    };
    const handleServiceRequestSubmit = (offerData) => {
        const clientId = localStorage.getItem('clientId');
        if (!clientId) {
            console.error('clientId not found in localStorage');
            alert('You must be logged in to make a request.');
            return;
        }

        const dataToSend = { ...offerData, clientId: clientId };

        fetch('http://localhost:3080/api/offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add offer');
                }
                return response.json();
            })
            .then(data => {
                console.log('Offer added successfully:', data);
                setShowServiceRequest(false);
            })
            .catch(error => {
                console.error('Error adding offer:', error);
                alert('Failed to add offer');
            });
    };



    const handleCloseServiceRequest = () => {
        setShowServiceRequest(false);
    };

    return (
        <>
            <TableContainer>

                {nearbyCleaners.length > 0 ? (
                    <StyledTable>
                        <thead>
                            <tr>
                                <TableHeader>Nom</TableHeader>
                                <TableHeader>Ville</TableHeader>
                                <TableHeader>Statut</TableHeader>
                                <TableHeader>Prix</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {nearbyCleaners.map((cleaner, index) => (
                                <TableRow key={index}>
                                    <TableCell>{cleaner.name}</TableCell>
                                    <TableCell>{cleaner.city}</TableCell>
                                    <TableCell>{cleaner.status}</TableCell>
                                    <TableCell>{cleaner.price}</TableCell>
                                    <TableCell>
                                        <ActionButton
                                            variant="contained"
                                            onClick={() => handleSendOffer(cleaner.id)}
                                        >
                                            Formuler une demande
                                        </ActionButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </StyledTable>
                ) : (
                    <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', color: '#013D5B' }}>
                        Aucun nettoyeur à proximité n'a été trouvé.
                    </Typography>

                )}
            </TableContainer>

            {showServiceRequest && (
                <Modal
                    open={showServiceRequest}
                    onClose={handleCloseServiceRequest}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div>
                        <ServiceRequest
                            onClose={handleCloseServiceRequest}
                            onSubmit={handleServiceRequestSubmit}
                            cleanerId={offerDetails.cleaner_id}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ClientDashboard;
