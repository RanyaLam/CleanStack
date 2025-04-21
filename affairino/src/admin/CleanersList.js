import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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

const UserContainer = styled(Paper)({
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '16px auto',
    maxWidth: '1000px',
    width: '100%',
});

const SearchContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    gap: '16px',
});

const UserTable = styled('table')({
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
});

const UserTableRow = styled('tr')({
    borderBottom: '1px solid #ddd',
});

const UserTableHeader = styled('th')({
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
});

const UserTableData = styled('td')({
    padding: '16px',
    textAlign: 'left',
});

const CleanersList = () => {
    const [cleaners, setCleaners] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCleaner, setSelectedCleaner] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newCleaner, setNewCleaner] = useState({
        name: '',
        mobile: '',
        email: '',
        city: '',
        price: '',
        latitude: '',
        longitude: '',
    });


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/cleaners')
            .then(response => response.json())
            .then(data => setCleaners(data))
            .catch(error => console.error('Error fetching cleaners:', error));
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredCleaners = cleaners.filter(cleaner =>
        cleaner.name.toLowerCase().includes(search.toLowerCase()) ||
        cleaner.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleViewClick = (cleaner) => {
        setSelectedCleaner(cleaner);
        setOpenViewDialog(true);
    };

    const handleViewClose = () => {
        setOpenViewDialog(false);
        setSelectedCleaner(null);
    };

    const handleAddCleanerClick = () => {
        setOpenAddDialog(true);
    };

    const handleAddCleanerClose = () => {
        setOpenAddDialog(false);
        setNewCleaner({
            name: '',
            mobile: '',
            email: '',
            city: '',
            price: '',
            latitude: '',
            longitude: '',
        });
    };

    const handleAddCleanerSubmit = () => {
        fetch('http://localhost:3080/api/admin/add-cleaner', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCleaner),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCleaners([...cleaners, data.cleaner]);
                    handleAddCleanerClose();
                } else {
                    console.error('Error adding cleaner:', data.message);
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error adding cleaner:', error);
                alert('Server error. Please try again later.');
            });
    };

    const handleInputChange = (e) => {
        setNewCleaner({ ...newCleaner, [e.target.name]: e.target.value });
    };

    return (
        <UserContainer>
            <Typography variant="h5" gutterBottom>
                Tous les Nettoyeurs
            </Typography>
            <SearchContainer>
                <TextField
                    label="Rechercher un nettoyeur"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                />
                <StyledButton onClick={handleAddCleanerClick}>Ajouter Nouveau</StyledButton>
            </SearchContainer>
            <UserTable>
                <thead>
                    <UserTableRow>
                        <UserTableHeader>Nom</UserTableHeader>
                        <UserTableHeader>Téléphone</UserTableHeader>
                        <UserTableHeader>Email</UserTableHeader>
                        <UserTableHeader>Action</UserTableHeader>
                    </UserTableRow>
                </thead>
                <tbody>
                    {filteredCleaners.map(cleaner => (
                        <UserTableRow key={cleaner.id}>
                            <UserTableData>{cleaner.name}</UserTableData>
                            <UserTableData>{cleaner.mobile}</UserTableData>
                            <UserTableData>{cleaner.email}</UserTableData>
                            <UserTableData>
                                <Button variant="contained" color="primary" onClick={() => handleViewClick(cleaner)} style={{ marginRight: '8px' }}>Voir</Button>
                            </UserTableData>
                        </UserTableRow>
                    ))}
                </tbody>
            </UserTable>


            <Dialog open={openViewDialog} onClose={handleViewClose}>
                <DialogTitle>Informations du Nettoyeur</DialogTitle>
                <DialogContent>
                    <DialogContentText>Nom: {selectedCleaner?.name}</DialogContentText>
                    <DialogContentText>Téléphone: {selectedCleaner?.mobile}</DialogContentText>
                    <DialogContentText>Email: {selectedCleaner?.email}</DialogContentText>
                    <DialogContentText>Status: {selectedCleaner?.status}</DialogContentText>
                    <DialogContentText>Ville: {selectedCleaner?.city}</DialogContentText>
                    <DialogContentText>Prix Par Heure: {selectedCleaner?.price} €</DialogContentText>
                    <DialogContentText>Latitude: {selectedCleaner?.latitude}</DialogContentText>
                    <DialogContentText>Longitude: {selectedCleaner?.longitude}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose} color="primary">Fermer</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleAddCleanerClose}>
                <DialogTitle>Ajouter un Nouveau Nettoyeur</DialogTitle>
                <DialogContent>
                    <TextField label="Nom" name="name" value={newCleaner.name} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Téléphone" name="mobile" value={newCleaner.mobile} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Email" name="email" value={newCleaner.email} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Ville" name="city" value={newCleaner.city} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Prix Par Heure" name="price" value={newCleaner.price} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Latitude" name="latitude" value={newCleaner.latitude} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Longitude" name="longitude" value={newCleaner.longitude} onChange={handleInputChange} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddCleanerClose} color="primary">Annuler</Button>
                    <Button onClick={handleAddCleanerSubmit} color="primary">Ajouter</Button>
                </DialogActions>
            </Dialog>
        </UserContainer>
    );
};

export default CleanersList;
