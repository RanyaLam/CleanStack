import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

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
    gap: '50px',
    fontSize: '0.75rem',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});


const StyledNavLink = styled(Link)({
    color: '#013D5B',
    textDecoration: 'none',
    fontSize: '0.90rem',
    '&:hover': {
        color: '#F4A157',
    },
});

const ActionButton = styled(Button)({
    backgroundColor: '#F4A157',
    color: '#013D5B',
    borderRadius: '24px',
    padding: '8px 20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    textTransform: 'none',
    fontSize: '0.85rem',
    '&:hover': {
        backgroundColor: '#F0C808',
    },
});

const ConnectButton = styled(ActionButton)({
    backgroundColor: '#708C69',
    color: '#FCF3E3',
});

const HeaderComponent = ({ setShowLogin }) => {
    const scrollToFooter = () => {
        document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Header>
            <Logo src="/logo.png" alt="AFFAIRINO Logo" />

            <Box display="flex" gap="16px">
                <ActionButton onClick={scrollToFooter}>Contactez-nous</ActionButton>
                <ConnectButton onClick={() => setShowLogin(true)}>Se connecter</ConnectButton>
            </Box>
        </Header>
    );
};

export default HeaderComponent;
