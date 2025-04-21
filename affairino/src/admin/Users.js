import React, { useState, useEffect } from 'react';
import { TextField, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled('button')({
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

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/clients')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <UserContainer>
            <Typography variant="h5" gutterBottom>
                Tous les Clients
            </Typography>
            <SearchContainer>
                <TextField
                    label="Rechercher un client"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                />

            </SearchContainer>
            <UserTable>
                <thead>
                    <UserTableRow>
                        <UserTableHeader>Nom</UserTableHeader>
                        <UserTableHeader>Téléphone</UserTableHeader>
                        <UserTableHeader>Email</UserTableHeader>
                        <UserTableHeader>Mot de passe</UserTableHeader>
                    </UserTableRow>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <UserTableRow key={user.id}>
                            <UserTableData>{user.name}</UserTableData>
                            <UserTableData>{user.mobile}</UserTableData>
                            <UserTableData>{user.email}</UserTableData>
                            <UserTableData>{user.password}</UserTableData>
                        </UserTableRow>
                    ))}
                </tbody>
            </UserTable>
        </UserContainer>
    );
};

export default Users;
