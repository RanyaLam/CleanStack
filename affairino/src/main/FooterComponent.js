import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, TextField, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = styled('footer')({
    backgroundColor: 'transparent',
    color: '#013D5B',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
});

const FooterContainer = styled('div')({
    maxWidth: '1200px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
});

const ContactSection = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '32px',
    width: '100%',
    maxWidth: '800px',
});

const FormSection = styled('div')({
    flex: 1,
    textAlign: 'center',
});

const InfoSection = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
});

const SocialIcons = styled(Box)({
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
});

const StyledTextField = styled(TextField)({
    '& label': {
        color: '#013D5B',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#013D5B',
    },
    '& .MuiInput-underline:hover:before': {
        borderBottomColor: '#F4A157',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#F4A157',
    },
    width: '100%',
});

const StyledButton = styled(Button)({
    backgroundColor: '#F4A157',
    color: '#013D5B',
    borderRadius: '24px',
    padding: '12px 24px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    '&:hover': {
        backgroundColor: '#F0C808',
    },
    marginTop: '16px',
    alignSelf: 'center',
});

const FooterComponent = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3080/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Message sent successfully!');

                setFormData({
                    name: '',
                    email: '',
                    message: '',
                });
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Footer id="contact-section">
            <FooterContainer>
                <ContactSection>
                    <FormSection>
                        <Typography
                            variant="h6"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                marginBottom: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            Contactez-nous
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <StyledTextField
                                label="Nom"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="standard"
                                required
                            />
                            <StyledTextField
                                label="E-mail"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                variant="standard"
                                required
                            />
                            <StyledTextField
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                variant="standard"
                                multiline
                                rows={4}
                                required
                            />
                            <StyledButton type="submit">Envoyer</StyledButton>
                        </form>
                    </FormSection>
                    <InfoSection>
                        <Typography variant="h6" style={{ fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                            Email
                        </Typography>
                        <Typography style={{ fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
                            direction@affairino.ma
                        </Typography>
                        <Typography variant="h6" style={{ fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                            Téléphone
                        </Typography>
                        <Typography style={{ fontFamily: 'Inter, sans-serif' }}>
                            0123456789
                        </Typography>
                    </InfoSection>
                </ContactSection>
                <SocialIcons>
                    <a href="https://www.facebook.com/affairino/" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon style={{ color: '#013D5B', fontSize: '32px' }} />
                    </a>
                    <a href="https://www.instagram.com/affairino/" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon style={{ color: '#013D5B', fontSize: '32px' }} />
                    </a>
                    <TwitterIcon style={{ color: '#013D5B', fontSize: '32px' }} />
                </SocialIcons>
            </FooterContainer>
        </Footer>
    );
};

export default FooterComponent;
