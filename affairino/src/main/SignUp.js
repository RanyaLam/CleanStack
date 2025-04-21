import React, { useState } from 'react';
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

const SignUp = ({ onLoginClick, onCleanerSignUpClick }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }


        fetch('http://localhost:3080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Inscription réussie !');
                    onLoginClick();
                } else if (data.errors) {

                    const errorMessages = data.errors.map(error => error.msg).join('\n');
                    alert(`Échec de l'inscription : ${errorMessages}`);
                } else {
                    alert(`Échec de l'inscription : ${data.message}`);
                }
            })
            .catch((error) => {
                console.error('Error during sign-up:', error);
                alert('Erreur lors de l\'inscription');
            });
    };

    return (
        <FormContainer>
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'Inter, sans-serif', color: '#013D5B', fontWeight: 'bold' }}>
                Créer votre compte
            </Typography>
            <StyledTextField
                label="Nom complet"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '40px' }}
            />
            <StyledTextField
                label="Adresse e-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
                label="Numéro de téléphone"
                type="text"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <StyledTextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <StyledTextField
                label="Confirmer le mot de passe"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormButton variant="contained" onClick={handleSignUp}>S'inscrire</FormButton>


            <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px', fontFamily: 'Inter, sans-serif', color: '#013D5B' }}>
                Vous avez déjà un compte ?{' '}
                <Button onClick={onLoginClick} style={{ color: '#F0C808' }}>Se connecter</Button>
            </Typography>


        </FormContainer>
    );
};

export default SignUp;
