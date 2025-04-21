import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Paper, Grid, Select, MenuItem, Modal } from '@mui/material';
import { styled } from '@mui/system';
import '@fontsource/inter';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRef } from 'react'



import FooterComponent from './FooterComponent';
import HeaderComponent from './HeaderComponent';
import TestimonialsSection from './TestimonialSection';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';

import AdminLayout from '../admin/AdminLayout';
import Dashboard from '../admin/Dashboard';
import Cities from '../admin/Cities';
import Offersbackup from '../admin/Offersbackup';
import ContactForms from '../admin/ContactForms';
import Administrator from '../admin/Administrator';
import Payments from '../admin/Payments';
import Users from '../admin/Users';



import CleanerLayout from '../cleaner/CleanerLayout';
import Profile from '../cleaner/Profile';
import Offers from '../cleaner/Offers';


import ClientLayout from '../client/ClientLayout';
import ClientDashboard from '../client/ClientDashboard';
import Profil from '../client/Profil';
import Demande from '../client/Demande';
import CurrentJobs from '../cleaner/CurrentJobs';
import CleanerReviews from '../cleaner/CleanerReviews';
import CleanersList from '../admin/CleanersList';







const BackgroundDiv = styled('div')({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #FCF3E3 0%, #93A39F 100%)',
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 600px)': {
    padding: '10px',
  },
});

const Main = styled('main')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#013D5B',
  padding: '40px 16px',
  '@media (max-width: 600px)': {
    padding: '20px',
  },
});




const TableContainer = styled(Paper)({
  width: '80%',
  margin: '20px auto',
  padding: '20px',
  borderRadius: '16px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
  color: '#013D5B',
  fontFamily: 'Inter, sans-serif',
});

const StyledTable = styled('table')({
  width: '100%',
  textAlign: 'left',
  borderSpacing: '0 10px',
  borderCollapse: 'collapse',
  fontFamily: 'Inter, sans-serif',
  color: '#013D5B',
});

const TableHeader = styled('th')({
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '1.2em',
  borderBottom: '2px solid #F0C808',
  color: '#013D5B',
  fontFamily: 'Inter, sans-serif',
});

const TableCell = styled('td')({
  padding: '10px',
  borderBottom: '1px solid #F0C808',
  color: '#013D5B',
  fontFamily: 'Inter, sans-serif',
});

const TableRow = styled('tr')({
  borderBottom: '1px solid #F0C808',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
});

const ActionButton = styled(Button)({
  backgroundColor: '#013D5B',
  color: 'white',
  borderRadius: '24px',
  padding: '10px 20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#0056b3',
  }
});


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNearbyCleaners, setShowNearbyCleaners] = useState(false);
  const [nearbyCleaners, setNearbyCleaners] = useState([]);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [offerDetails, setOfferDetails] = useState({ price: '', description: '', cleaner_id: '' });
  const [cleanerId, setCleanerId] = useState(null);
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleLoginAttempt = (email, password) => {
    fetch('http://localhost:3080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'success') {
          const role = data.role;

          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'client') {
            localStorage.setItem('clientId', data.clientId);
            navigate('/client/clientdashboard');
          } else if (role === 'cleaner') {
            localStorage.setItem('cleanerId', data.cleanerId);
            navigate('/cleaner/profile');
          }
        } else {
          alert('Invalid credentials');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      });
  };








  const onSignUp = ({ name, email, phone, password }) => {
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
          console.log('Inscription réussie :', data);
          alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          setShowSignUp(false);
          setShowLogin(true);
        } else if (data.errors) {

          const errorMessages = data.errors.map(error => error.msg).join('\n');
          alert(`Échec de l'inscription : ${errorMessages}`);
        } else {
          alert(`Échec de l'inscription : ${data.message || 'Veuillez réessayer.'}`);
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'inscription :', error);
        alert('Une erreur est survenue lors de l\'inscription.');
      });
  };


  const handleLogin = (adminStatus) => {
    setShowLogin(false);
    setShowSignUp(false);
    setIsAdmin(adminStatus);
  };


  const handleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleFindCleanersNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyCleaners(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchNearbyCleaners = (latitude, longitude) => {
    fetch(`http://localhost:3080/api/cleaners/nearby?latitude=${latitude}&longitude=${longitude}`)
      .then((response) => response.json())
      .then((data) => {
        setNearbyCleaners(data);
      })
      .catch((error) => console.error('Error fetching nearby cleaners:', error));
  };
  const handleSendOffer = () => {
    alert('Please connect to your account to make a request.');
    setShowLogin(true);
  };




  return (
    <>

      <Routes>
        <Route path="/" element={

          <BackgroundDiv>
            <HeaderComponent
              handleLoginAttempt={handleLoginAttempt}
              handleFindCleanersNearby={handleFindCleanersNearby}
              setShowLogin={setShowLogin}
            />


            {showLogin && !showSignUp && (
              <Login
                onLogin={handleLoginAttempt}
                onSignUpClick={handleSignUp}
              />
            )}
            {showSignUp && (
              <SignUp
                onLoginClick={handleLoginClick}
                onCleanerSignUpClick={() => alert("Cleaner sign-up clicked!")}
              />
            )}



            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '60px 40px',
            }}>
              <Box sx={{
                textAlign: 'left',
                maxWidth: '45%',
              }}>
                <Typography variant="h2" sx={{
                  fontWeight: '900',
                  fontSize: '4rem',
                  color: '#013D5B',
                  lineHeight: '1.2',
                  mb: 2,
                }}>
                  Votre espace propre, organisé et impeccable en 24 heures !
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#F4A157',
                    padding: '12px 24px',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    mt: 1,
                    borderRadius: '30px',
                    color: '#013D5B',
                    textTransform: 'none',
                  }}
                  onClick={handleFindCleanersNearby}
                >
                  Trouver des nettoyeurs à proximité
                </Button>
              </Box>


              <img src="/image.png" alt="Laundry Service" style={{
                maxWidth: '50%',
                height: 'auto',
                objectFit: 'contain',
                marginLeft: '5%',
              }} />
            </Box>




            {nearbyCleaners.length > 0 && (
              <Box sx={{
                position: 'relative',
                width: '100%',
                padding: '20px',
                marginTop: '20px'
              }}>

                <TableContainer>
                  <StyledTable>
                    <thead>
                      <tr>
                        <TableHeader>Nom</TableHeader>
                        <TableHeader>Ville</TableHeader>
                        <TableHeader>Statut</TableHeader>
                        <TableHeader>Prix</TableHeader>
                        <TableHeader>Action</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {nearbyCleaners.map((cleaner, index) => (
                        <TableRow key={index}>
                          <TableCell>{cleaner.name}</TableCell>
                          <TableCell>{cleaner.city}</TableCell>
                          <TableCell>{cleaner.status}</TableCell>
                          <TableCell>{cleaner.price}</TableCell>
                          <TableCell>
                            <ActionButton
                              variant="contained"
                              onClick={() => handleSendOffer(cleaner.id)}
                            >
                              Formuler une demande
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </Box>
            )}



            <Box sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
              padding: '20px 0',
              marginTop: '20px',
            }}>

              <Box sx={{
                textAlign: 'center',
                maxWidth: '200px',
                position: 'relative',
              }}>

                <Box sx={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#F4A157',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: '-1',
                }} />
                <img src="/maison.png" alt="Nettoyage Express" style={{ height: '50px', marginBottom: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Express</Typography>
                <Typography variant="body2" sx={{ color: '#013D5B' }}>Votre espace nettoyé et rangé en un temps record</Typography>
              </Box>


              <Box sx={{
                textAlign: 'center',
                maxWidth: '200px',
                position: 'relative',
              }}>
                <Box sx={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#F4A157',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: '-1',
                }} />
                <img src="/chariot.png" alt="Nettoyage Personnalisé" style={{ height: '50px', marginBottom: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Personnalisé</Typography>
                <Typography variant="body2" sx={{ color: '#013D5B' }}>Des solutions adaptées à chaque besoin spécifique</Typography>
              </Box>


              <Box sx={{
                textAlign: 'center',
                maxWidth: '200px',
                position: 'relative',
              }}>
                <Box sx={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#F4A157',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: '-1',
                }} />
                <img src="/customer-service.png" alt="Service Clientèle" style={{ height: '50px', marginBottom: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Service Clientèle</Typography>
                <Typography variant="body2" sx={{ color: '#013D5B' }}>Un service client à votre écoute 24/7</Typography>
              </Box>
            </Box>


            <Box sx={{
              padding: '60px 0',
              backgroundColor: 'transparent',
            }}>
              <Typography variant="h3" sx={{
                textAlign: 'center',
                fontWeight: '900',
                color: '#013D5B',
                mb: 5,
              }}>
                Nos services
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
                {/* Service 1: Nettoyage Résidentiel */}
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <img src="/3.png" alt="Nettoyage Résidentiel" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                  <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Résidentiel</Typography>
                </Box>

                {/* Service 2: Nettoyage Commercial */}
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <img src="/2.png" alt="Nettoyage Commercial" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                  <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Commercial</Typography>
                </Box>

                {/* Service 3: Entretien Ménager */}
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <img src="/4.png" alt="Entretien Ménager" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                  <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Entretien Ménager</Typography>
                </Box>

                {/* Service 4: Nettoyage de Tapis */}
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <img src="/g.png" alt="Nettoyage de Tapis" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                  <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage de Tapis</Typography>
                </Box>
              </Box>
            </Box>


            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '60px 40px',
              backgroundColor: 'transparent',
              fontFamily: 'Inter, sans-serif',
            }}>

              <Box sx={{
                maxWidth: '45%',
              }}>
                <img src="/6.png" alt="À propos de nous" style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }} />
              </Box>


              <Box sx={{
                maxWidth: '50%',
                textAlign: 'left',
              }}>
                <Typography variant="h3" sx={{
                  fontWeight: '900',
                  color: '#013D5B',
                  mb: 3,
                }}>
                  À propos de nous
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: '1.2rem',
                  color: '#013D5B',
                  mb: 4,
                }}>
                  Chez Affairino, nous nous engageons à offrir un service de nettoyage rapide, fiable et de haute qualité.
                </Typography>


                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#708C69',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2,
                  }}>
                    <img src="/nettoyage.png" alt="Livraison Express" style={{ width: '60%' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Express</Typography>
                    <Typography variant="body2" sx={{ color: '#013D5B' }}>Un service de nettoyage rapide et efficace</Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#708C69',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2,
                  }}>
                    <img src="/produits.png" alt="Nettoyage Personnalisé" style={{ width: '60%' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Nettoyage Personnalisé</Typography>
                    <Typography variant="body2" sx={{ color: '#013D5B' }}>Des solutions de nettoyage sur mesure</Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#708C69',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2,
                  }}>
                    <img src="/service.png" alt="Service Clientèle" style={{ width: '60%' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Service Clientèle</Typography>
                    <Typography variant="body2" sx={{ color: '#013D5B' }}>Un service client disponible 24/7</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>







            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '60px 40px',
              backgroundColor: 'transparent',
              position: 'relative',
              fontFamily: 'Inter, sans-serif',
            }}>



              <Box sx={{ maxWidth: '45%', position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{
                  color: '#013D5B',
                  fontWeight: '700',
                  textAlign: 'center',
                  mb: 2,
                }}>
                  FAQ
                </Typography>


                <Accordion sx={{ backgroundColor: '#BCD2CD', mb: 2, borderRadius: '12px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Comment fonctionne votre service de nettoyage ?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#013D5B' }}>
                      Notre service vous permet de trouver des nettoyeurs qualifiés dans votre région. Vous pouvez sélectionner le service dont vous avez besoin, choisir un nettoyeur et fixer une date pour le nettoyage. Le nettoyeur se rendra à votre adresse à la date et à l'heure convenues.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ backgroundColor: '#BCD2CD', mb: 2, borderRadius: '12px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Quels types de services de nettoyage proposez-vous ?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#013D5B' }}>
                      Nous proposons une gamme complète de services de nettoyage, y compris le nettoyage résidentiel, commercial, et le nettoyage spécialisé comme le nettoyage de tapis, le lavage des vitres, et le nettoyage après déménagement.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ backgroundColor: '#BCD2CD', mb: 2, borderRadius: '12px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Est-ce que les produits de nettoyage sont fournis par les nettoyeurs ?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#013D5B' }}>
                      Oui, tous les nettoyeurs apportent leurs propres produits de nettoyage, mais si vous avez des préférences spécifiques ou souhaitez que vos propres produits soient utilisés, il suffit de le signaler lors de la réservation.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ backgroundColor: '#BCD2CD', mb: 2, borderRadius: '12px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#013D5B' }}>Comment puis-je annuler ou modifier une réservation ?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#013D5B' }}>
                      Vous pouvez annuler ou modifier une réservation via votre compte en ligne jusqu'à 24 heures avant l'heure prévue du service. Des frais peuvent s'appliquer pour les annulations tardives.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>



              <Box sx={{ maxWidth: '45%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Box>
                  <img src="/s.png" alt="Custom Service" style={{
                    width: '110%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '12px',
                  }} />
                </Box>
              </Box>
            </Box>
            <TestimonialsSection />


            <Main>

            </Main>

            <FooterComponent />
          </BackgroundDiv>

        } />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cities" element={<Cities />} />
          <Route path="offers" element={<Offersbackup />} />
          <Route path="contact-forms" element={<ContactForms />} />
          <Route path="administrator" element={<Administrator />} />
          <Route path="payments" element={<Payments />} />
          <Route path="users" element={<Users />} />
          <Route path="cleanerslist" element={<CleanersList />} />
        </Route>
        <Route path="/cleaner/*" element={<CleanerLayout />}>
          <Route path="offers" element={<Offers cleanerId={cleanerId} />} />
          <Route path="profile" element={<Profile />} />

          <Route path="cleanerreviews" element={<CleanerReviews />} />
          <Route path="currentjobs" element={<CurrentJobs />} />
        </Route>
        <Route path="/client/*" element={<ClientLayout />}>
          <Route path="clientdashboard" element={<ClientDashboard />} />
          <Route path="Profil" element={<Profil />} />
          <Route path="Demande" element={<Demande />} />

        </Route>


      </Routes >
    </>
  );
}

export default App;