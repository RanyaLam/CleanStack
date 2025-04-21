import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
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

const AdminContainer = styled(Paper)({
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

const AdminTable = styled('table')({
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
});

const AdminTableRow = styled('tr')({
    borderBottom: '1px solid #ddd',
});

const AdminTableHeader = styled('th')({
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
});

const AdminTableData = styled('td')({
    padding: '16px',
    textAlign: 'left',
});

const administratorsData = [
    { id: 1, name: 'Ranya', phone: '+212638263527', email: 'ranya@gmail.com' },
    { id: 2, name: 'Admin', phone: '+212635183933', email: 'admin@gmail.com' },
];

const Administrator = () => {
    const [administrators, setAdministrators] = useState(administratorsData);
    const [search, setSearch] = useState('');

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredAdministrators = administrators.filter(admin =>
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminContainer>
            <Typography variant="h5" gutterBottom>
                All Administrators
            </Typography>
            <SearchContainer>
                <TextField
                    label="Search Administrator"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                />

            </SearchContainer>
            <AdminTable>
                <thead>
                    <AdminTableRow>
                        <AdminTableHeader>Id</AdminTableHeader>
                        <AdminTableHeader>Name</AdminTableHeader>
                        <AdminTableHeader>Phone</AdminTableHeader>
                        <AdminTableHeader>Email</AdminTableHeader>
                        <AdminTableHeader>Actions</AdminTableHeader>
                    </AdminTableRow>
                </thead>
                <tbody>
                    {filteredAdministrators.map(admin => (
                        <AdminTableRow key={admin.id}>
                            <AdminTableData>{admin.id}</AdminTableData>
                            <AdminTableData>{admin.name}</AdminTableData>
                            <AdminTableData>{admin.phone}</AdminTableData>
                            <AdminTableData>{admin.email}</AdminTableData>
                            <AdminTableData>
                                <Button variant="contained" color="error">Delete</Button>
                            </AdminTableData>
                        </AdminTableRow>
                    ))}
                </tbody>
            </AdminTable>
        </AdminContainer>
    );
};

export default Administrator;
