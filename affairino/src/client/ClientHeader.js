import React from 'react';
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import { Outlet, Link, useNavigate } from 'react-router-dom';


const IconStyle = {
    marginRight: '8px',
    width: '24px',
    height: '24px',
    verticalAlign: 'middle',
};


const Header = styled('header')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    backgroundColor: 'transparent',
    margin: 0,
    boxShadow: 'none',
});

const Logo = styled('img')({
    height: '140px',
    width: 'auto',
});

const NavLinks = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '80px',
    fontSize: '0.75rem',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const StyledNavLink = styled(Link)({
    color: '#013D5B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    '&:hover': {
        color: '#F4A157',
    },
});

const StyledButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: '#013D5B',
    borderRadius: '24px',
    padding: '8px 20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    textTransform: 'none',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: '#013D5B',
    },
});

const ClientHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };
    return (
        <Header>
            <Logo src="/logo.png" alt="AFFAIRINO Logo" />
            <NavLinks>
                <StyledNavLink to="/client/clientdashboard">
                    <img src="/home.png" alt="Home" style={IconStyle} /> Accueil
                </StyledNavLink>
                <StyledNavLink to="/client/profil">
                    <img src="/profile.png" alt="Profile" style={IconStyle} /> Mon Profil
                </StyledNavLink>
                <StyledNavLink to="/client/demande">
                    <img src="/demande.png" alt="Demande" style={IconStyle} /> Mes Demandes
                </StyledNavLink>

            </NavLinks>
            <Box display="flex" gap="16px">
                <StyledButton onClick={handleLogout}>
                    <img src="/logout.png" alt="Logout" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                    Déconnexion
                </StyledButton>
            </Box>
        </Header>
    );
};

export default ClientHeader;
