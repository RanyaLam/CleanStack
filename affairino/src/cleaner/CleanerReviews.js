import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const ReviewsContainer = styled(TableContainer)({
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

const CleanerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const cleanerId = localStorage.getItem('cleanerId');

    useEffect(() => {
        fetch(`http://localhost:3080/api/admin/client-reviews?cleanerId=${cleanerId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReviews(data);
                } else {
                    setError('Failed to fetch reviews');
                }
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                setError('Error fetching reviews');
            });
    }, []);

    return (
        <ReviewsContainer component={Paper}>
            <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '20px', fontWeight: 'bold', color: '#013D5B' }}>
                Avis sur votre travail
            </Typography>
            {error ? (
                <Typography variant="body1" color="error" align="center">{error}</Typography>
            ) : (
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Client</TableHeaderCell>
                            <TableHeaderCell>Avis</TableHeaderCell>
                            <TableHeaderCell>Note</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review) => (
                            <StyledTableRow key={review.id}>
                                <TableDataCell>{review.client}</TableDataCell>
                                <TableDataCell>{review.review}</TableDataCell>
                                <TableDataCell>{review.rating}</TableDataCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            )}
        </ReviewsContainer>
    );

};

export default CleanerReviews;
