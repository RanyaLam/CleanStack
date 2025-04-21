import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function TestimonialsSection() {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonialsToShow = 2;


    useEffect(() => {
        fetch('http://localhost:3080/api/reviews')
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? reviews.length - testimonialsToShow : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === reviews.length - testimonialsToShow ? 0 : prevIndex + 1
        );
    };


    const displayedTestimonials = reviews.slice(currentIndex, currentIndex + testimonialsToShow);

    return (
        <Box sx={{
            padding: '60px 0',
            backgroundColor: 'transparent',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            position: 'relative',
            maxWidth: '90%',
            margin: '0 auto',
        }}>

            <Typography variant="h4" sx={{
                color: '#013D5B',
                fontWeight: '900',
                marginBottom: '40px',
            }}>
                Les avis de nos clients
            </Typography>


            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                position: 'relative',
            }}>

                <Box sx={{
                    position: 'absolute',
                    left: '-60px',
                    cursor: 'pointer',
                    zIndex: 2,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                    onClick={handlePrevClick}>
                    <img src="/left-arrow.png" alt="Previous" style={{ width: '40px', height: '40px' }} />
                </Box>


                {displayedTestimonials.map((review, index) => (
                    <Box key={index} sx={{
                        backgroundColor: '#93A39F',
                        padding: '20px',
                        borderRadius: '20px',
                        width: '300px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                    }}>
                        <Typography variant="body1" sx={{
                            color: '#FFFFFF',
                            marginBottom: '10px',
                        }}>
                            {review.review_text}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: '#FFD700',
                        }}>
                            Note: {review.rating}/5
                        </Typography>
                    </Box>
                ))}

                <Box sx={{
                    position: 'absolute',
                    right: '-60px',
                    cursor: 'pointer',
                    zIndex: 2,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                    onClick={handleNextClick}>
                    <img src="/right-arrow.png" alt="Next" style={{ width: '40px', height: '40px' }} />
                </Box>
            </Box>
        </Box>
    );
}

export default TestimonialsSection;
