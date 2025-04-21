import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Dashboard, LocationCity, People, LocalOffer, Payment, ContactMail, Person, ExitToApp, Menu as MenuIcon } from '@mui/icons-material';
import AdminHeader from './AdminHeader';

const BackgroundDiv = styled('div')({
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FCF3E3 0%, #93A39F 100%)',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 600px)': {
        padding: '10px',
    },
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
    gap: '20px',
    fontSize: '0.75rem',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
    padding: '16px',
});

const StyledNavLink = styled(Link)({
    color: '#013D5B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    '&:hover': {
        color: '#F4A157',
    },
    display: 'flex',
    alignItems: 'center',
});

function AdminLayout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <BackgroundDiv>

            <AdminHeader toggleDrawer={toggleDrawer} />


            <DrawerStyled
                variant="temporary"
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer}
            >
                <NavLinks>
                    <List>
                        <ListItem button component={StyledNavLink} to="/admin/dashboard">
                            <ListItemIcon>
                                <Dashboard style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Tableau de Bord" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/users">
                            <ListItemIcon>
                                <People style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Liste des clients" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/cleanerslist">
                            <ListItemIcon>
                                <Person style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Liste des nettoyeurs" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/offers">
                            <ListItemIcon>
                                <LocalOffer style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Offres" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/payments">
                            <ListItemIcon>
                                <Payment style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Paiements" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/cities">
                            <ListItemIcon>
                                <LocationCity style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Villes" />
                        </ListItem>


                        <ListItem button component={StyledNavLink} to="/admin/contact-forms">
                            <ListItemIcon>
                                <ContactMail style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Formulaires de Contact" />
                        </ListItem>

                        <ListItem button component={StyledNavLink} to="/admin/administrator">
                            <ListItemIcon>
                                <Person style={{ color: '#013D5B' }} />
                            </ListItemIcon>
                            <ListItemText primary="Administrateur" />
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

export default AdminLayout;
