import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocalOffer, Work, Person, Payment, Reviews } from '@mui/icons-material';
import CleanerHeader from './CleanerHeader';

const BackgroundDiv = styled('div')({
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FCF3E3 0%, #93A39F 100%)',
    display: 'flex',
    flexDirection: 'column',
});

const DrawerStyled = styled(Drawer)({
    '& .MuiDrawer-paper': {
        width: 240,
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
});

const NavLinks = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
});

const StyledNavLink = styled(Link)({
    color: '#013D5B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        color: '#F4A157',
    },
});

function CleanerLayout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <BackgroundDiv>
            <CleanerHeader toggleDrawer={toggleDrawer} />

            {/* Sidebar Drawer */}
            <DrawerStyled
                variant="temporary"
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer}
            >
                <NavLinks>
                    <List>
                        <ListItem button component={StyledNavLink} to="/cleaner/Offers">
                            <ListItemIcon>
                                <LocalOffer style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Mes offres" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/cleaner/CurrentJobs">
                            <ListItemIcon>
                                <Work style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Mes tâches actuelles" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/cleaner/Profile">
                            <ListItemIcon>
                                <Person style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Mon Profil" />
                        </ListItem>



                        <ListItem button component={StyledNavLink} to="/cleaner/CleanerReviews">
                            <ListItemIcon>
                                <Reviews style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Mes reviews" />
                        </ListItem>
                    </List>
                </NavLinks>
            </DrawerStyled>

            <Box sx={{ padding: '20px', marginTop: '100px' }}>
                <Outlet />
            </Box>
        </BackgroundDiv>
    );
}

export default CleanerLayout;
