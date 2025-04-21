import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import FooterComponent from '../main/FooterComponent';
import { Button, Box, Typography } from '@mui/material';


import ClientHeader from './ClientHeader';
import '@fontsource/inter';

const BackgroundDiv = styled('div')({
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FCF3E3 0%, #93A39F 100%)',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 600px)': {
        padding: '10px',
    },
});




const ClientLayout = () => {


    return (
        <BackgroundDiv>
            <ClientHeader></ClientHeader>

            <Box sx={{ flexGrow: 1, paddingBottom: '200px' }}>
                <Outlet />
            </Box>

            <FooterComponent />
        </BackgroundDiv>
    );
};

export default ClientLayout;
