import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { styled } from '@mui/system';

const PaperContainer = styled(Paper)({
    padding: '20px',
    marginBottom: '30px',
    backgroundColor: 'transparent',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const [transactionsData, setTransactionsData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [cleanersData, setCleanersData] = useState([]);
    const [clientsReviews, setClientsReviews] = useState([]); // Initialized as an array


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/transactions')
            .then((response) => response.json())
            .then((data) => setTransactionsData(data))
            .catch((error) => console.error('Error fetching transactions data:', error));
    }, []);


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/revenue')
            .then((response) => response.json())
            .then((data) => setRevenueData(data))
            .catch((error) => console.error('Error fetching revenue data:', error));
    }, []);


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/cleaners-jobs')
            .then((response) => response.json())
            .then((data) => setCleanersData(data))
            .catch((error) => console.error('Error fetching cleaners jobs data:', error));
    }, []);


    useEffect(() => {
        fetch('http://localhost:3080/api/admin/client-reviews')
            .then((response) => response.json())
            .then((data) => {
                // Ensure the data is an array
                if (Array.isArray(data)) {
                    setClientsReviews(data);
                } else {
                    setClientsReviews([]); // Fallback to empty array if data is not an array
                }
            })
            .catch((error) => console.error('Error fetching client reviews:', error));
    }, []);

    return (
        <Box padding="40px">
            <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#013D5B' }}>
                Tableau de Bord de l'Administrateur
            </Typography>

            <PaperContainer>
                <Typography variant="h6" gutterBottom>
                    Transactions
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={transactionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_offers" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </PaperContainer>

            <PaperContainer>
                <Typography variant="h6" gutterBottom>
                    Revenu
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total_revenue" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </PaperContainer>

            <PaperContainer>
                <Typography variant="h6" gutterBottom>
                    Tâches des Nettoyeurs
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={cleanersData}
                            dataKey="jobs_done"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            {cleanersData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </PaperContainer>

            <PaperContainer>
                <Typography variant="h6" gutterBottom>
                    Avis des Clients
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Client</TableCell>
                                <TableCell>Avis</TableCell>
                                <TableCell>Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Ensure clientsReviews is an array before mapping */}
                            {Array.isArray(clientsReviews) && clientsReviews.length > 0 ? (
                                clientsReviews.map((review) => (
                                    <TableRow key={review.client}>
                                        <TableCell>{review.client}</TableCell>
                                        <TableCell>{review.review}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>Aucun avis disponible</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </PaperContainer>
        </Box>
    );
};

export default Dashboard;
