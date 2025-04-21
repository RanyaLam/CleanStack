import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const FormContainer = styled(Paper)({
    padding: '32px',
    maxWidth: '400px',
    margin: '32px auto',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#013D5B',
    fontFamily: 'Inter, sans-serif',
});

const FormButton = styled(Button)({
    backgroundColor: '#F0C808',
    color: '#013D5B',
    padding: '12px 24px',
    borderRadius: '24px',
    display: 'block',
    margin: '16px auto 0',
    textTransform: 'none',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#F4A157',
    },
});

const StyledTextField = styled(TextField)({
    '& label': {
        color: '#013D5B',
        fontFamily: 'Inter, sans-serif',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#F0C808',
        },
        '&:hover fieldset': {
            borderColor: '#F4A157',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#F0C808',
        },
    },
    marginBottom: '16px',
});

const Login = ({ onLogin, onSignUpClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin(email, password);
    };

    return (
        <FormContainer>
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'Inter, sans-serif', color: '#013D5B', fontWeight: 'bold' }}>
                Connexion
            </Typography>
            <StyledTextField
                label="Adresse e-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginTop: '24px' }}
            />
            <StyledTextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <FormButton variant="contained" onClick={handleLogin}>Se connecter</FormButton>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px', fontFamily: 'Inter, sans-serif', color: '#013D5B' }}>
                Vous n'avez pas de compte ?{' '}
                <Button onClick={onSignUpClick} style={{ color: '#F0C808' }}>Créer un compte</Button>
            </Typography>
        </FormContainer>
    );
};

export default Login;
