import React from 'react';
import { styled } from '@mui/system';
import { Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';


const Header = styled('header')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    position: 'fixed',
    width: '100%',
    zIndex: 1100,
});

const Logo = styled('img')({
    height: '110px',
    width: 'auto',
    marginLeft: '10px',
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
    position: 'relative',
    right: '70px',
});


const AdminHeader = ({ toggleDrawer }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Header>
            <Box display="flex" alignItems="center">

                <IconButton onClick={toggleDrawer} style={{ marginRight: '8px' }}>
                    <MenuIcon style={{ color: '#013D5B', fontSize: '27px' }} />
                </IconButton>

                <Logo src="/logo.png" alt="AFFAIRINO Logo" />
            </Box>

            <StyledButton onClick={handleLogout}>
                <img src="/logout.png" alt="Logout" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                Déconnexion
            </StyledButton>
        </Header>
    );
};

export default AdminHeader;
