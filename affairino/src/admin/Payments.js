import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: '#1F2833',
    borderRadius: '24px',
    padding: '12px 24px',
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: '#FFD700',
    },
});

const PaymentContainer = styled(Paper)({
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '16px auto',
    maxWidth: '1000px',
    width: '100%',
});

const PaymentTable = styled('table')({
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
});

const PaymentTableRow = styled('tr')({
    borderBottom: '1px solid #ddd',
});

const PaymentTableHeader = styled('th')({
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
});

const PaymentTableData = styled('td')({
    padding: '16px',
    textAlign: 'left',
});

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [newMethod, setNewMethod] = useState('');
    const [newStatus, setNewStatus] = useState('active');
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/payments')
            .then(response => response.json())
            .then(data => setPayments(data))
            .catch(error => console.error('Erreur lors de la récupération des paiements:', error));
    }, []);

    const handleAddPayment = () => {
        setIsEditing(false);
        setNewMethod('');
        setNewStatus('active');
        setOpenDialog(true);
    };

    const handleEditPayment = (payment) => {
        setIsEditing(true);
        setSelectedPayment(payment);
        setNewMethod(payment.method);
        setNewStatus(payment.status);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPayment(null);
    };

    const handleSavePayment = () => {
        if (isEditing) {

            fetch(`http://localhost:3080/api/admin/update-payment/${selectedPayment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ method: newMethod, status: newStatus }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setPayments(payments.map(payment =>
                            payment.id === selectedPayment.id ? { ...payment, method: newMethod, status: newStatus } : payment
                        ));
                    }
                    handleCloseDialog();
                })
                .catch(error => console.error('Erreur lors de la mise à jour du paiement:', error));
        } else {

            fetch('http://localhost:3080/api/admin/add-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ method: newMethod, status: newStatus }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setPayments([...payments, data.payment]);
                    }
                    handleCloseDialog();
                })
                .catch(error => console.error('Erreur lors de l\'ajout du paiement:', error));
        }
    };

    return (
        <PaymentContainer>
            <Typography variant="h5" align="center">
                Tous les Paiements
            </Typography>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <StyledButton onClick={handleAddPayment}>Ajouter Nouveau</StyledButton>
            </Box>
            <PaymentTable>
                <thead>
                    <PaymentTableRow>
                        <PaymentTableHeader>ID</PaymentTableHeader>
                        <PaymentTableHeader>Méthode</PaymentTableHeader>
                        <PaymentTableHeader>Statut</PaymentTableHeader>
                        <PaymentTableHeader>Action</PaymentTableHeader>
                    </PaymentTableRow>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <PaymentTableRow key={payment.id}>
                            <PaymentTableData>{payment.id}</PaymentTableData>
                            <PaymentTableData>{payment.method}</PaymentTableData>
                            <PaymentTableData>
                                <Button variant="contained" color="success">{payment.status}</Button>
                            </PaymentTableData>
                            <PaymentTableData>
                                <Button variant="contained" color="primary" onClick={() => handleEditPayment(payment)}>Modifier</Button>
                            </PaymentTableData>
                        </PaymentTableRow>
                    ))}
                </tbody>
            </PaymentTable>


            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Modifier le mode de paiement' : 'Ajouter un nouveau mode de paiement'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Méthode"
                        value={newMethod}
                        onChange={(e) => setNewMethod(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Statut"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSavePayment} color="primary">
                        {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PaymentContainer>
    );
};

export default Payments;
