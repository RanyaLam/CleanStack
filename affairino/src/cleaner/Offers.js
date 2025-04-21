import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

const OffersContainer = styled(TableContainer)({
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

const ActionButton = styled(Button)({
  borderRadius: '24px',
  padding: '8px 16px',
  marginLeft: '8px',
  textTransform: 'none',
  fontWeight: 'bold',
});

const AcceptButton = styled(ActionButton)({
  backgroundColor: '#4caf50',
  color: 'white',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
});

const RejectButton = styled(ActionButton)({
  backgroundColor: '#f44336',
  color: 'white',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
});

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanerId = localStorage.getItem('cleanerId');
    if (cleanerId) {
      fetch(`http://localhost:3080/api/offers?cleanerId=${cleanerId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOffers(data);
          } else {
            setError('Failed to fetch offers');
          }
        })
        .catch(error => {
          console.error('Error fetching offers:', error);
          setError('Error fetching offers');
        });
    } else {
      setError('Cleaner ID not found');
    }
  }, []);


  const handleAccept = (id) => {
    fetch('http://localhost:3080/api/offers/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: 'in-progress', decision_date: new Date().toISOString() } : offer));
        } else {
          alert('Failed to accept offer');
        }
      })
      .catch(error => console.error('Error accepting offer:', error));
  };


  const handleReject = (id) => {
    fetch('http://localhost:3080/api/offers/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, status: 'rejected', decision_date: new Date().toISOString() } : offer));
        } else {
          alert('Failed to reject offer');
        }
      })
      .catch(error => console.error('Error rejecting offer:', error));
  };

  return (
    <OffersContainer component={Paper}>
      <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '20px', fontWeight: 'bold', color: '#013D5B' }}>
        Offres
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
            {offers.map((offer) => (
              <StyledTableRow key={offer.id}>
                <TableDataCell>{offer.id}</TableDataCell>
                <TableDataCell>{offer.price} €</TableDataCell>
                <TableDataCell>{offer.description}</TableDataCell>
                <TableDataCell>
                  <AcceptButton
                    onClick={() => handleAccept(offer.id)}
                    disabled={offer.status !== 'pending'}
                  >
                    Accepter
                  </AcceptButton>
                  <RejectButton
                    onClick={() => handleReject(offer.id)}
                    disabled={offer.status !== 'pending'}
                  >
                    Refuser
                  </RejectButton>
                </TableDataCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}
    </OffersContainer>
  );
};

export default Offers;
