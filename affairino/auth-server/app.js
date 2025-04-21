const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




app.use(morgan('dev'));

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;



app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'projectdb'
});


db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.get('/', (_req, res) => {
    res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication');
});


app.post('/auth', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], (req, res) => {
    const { email, password } = req.body;


    db.query('SELECT * FROM clients WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        if (results.length === 1) {

            const client = results[0];
            bcrypt.compare(password, client.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).send('Error comparing passwords');
                }

                if (isMatch) {
                    const token = jwt.sign({ email, role: 'client', clientId: client.id }, jwtSecretKey);
                    return res.json({ message: 'success', token, role: 'client', clientId: client.id });
                } else {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {

            db.query('SELECT * FROM cleaners WHERE email = ?', [email], (err, results) => {
                if (err) {
                    return res.status(500).send('Server error');
                }

                if (results.length === 1) {

                    const cleaner = results[0];
                    bcrypt.compare(password, cleaner.password, (err, isMatch) => {
                        if (err) {
                            return res.status(500).send('Error comparing passwords');
                        }

                        if (isMatch) {
                            const token = jwt.sign({ email, role: 'cleaner', cleanerId: cleaner.id }, jwtSecretKey);
                            return res.json({ message: 'success', token, role: 'cleaner', cleanerId: cleaner.id });
                        } else {
                            return res.status(401).json({ message: 'Invalid credentials' });
                        }
                    });
                } else {

                    if (email === 'admin123@gmail.com' && password === 'admin') {
                        // Admin hardcoded credentials (can change this as needed)
                        const token = jwt.sign({ email, role: 'admin' }, jwtSecretKey);
                        return res.json({ message: 'success', token, role: 'admin' });
                    } else {
                        return res.status(401).json({ message: 'Invalid email or password' });
                    }
                }
            });
        }
    });
});






app.post('/verify', (req, res) => {
    const tokenHeaderKey = 'jwt-token';
    const authToken = req.headers[tokenHeaderKey];
    try {
        const verified = jwt.verify(authToken, process.env.JWT_SECRET_KEY || 'dsfdsfsdfdsvcsvdfgefg');
        if (verified) {
            return res.status(200).json({ status: 'logged in', message: 'success' });
        } else {
            return res.status(401).json({ status: 'invalid auth', message: 'error' });
        }
    } catch (error) {
        return res.status(401).json({ status: 'invalid auth', message: 'error' });
    }
});


app.post('/check-account', (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server error');
            return;
        }

        res.status(200).json({
            status: results.length === 1 ? 'User exists' : 'User does not exist',
            userExists: results.length === 1,
        });
    });
});

app.post('/signup', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Must be a valid email'),
    check('phone').isMobilePhone().withMessage('Must be a valid phone number'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;


    db.query('SELECT * FROM clients WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error when checking email' });
        }

        if (results.length > 0) {

            return res.status(400).json({ success: false, message: 'Email is already registered as a client' });
        }

        bcrypt.hash(password, 12, (err, hashedPassword) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).json({ success: false, message: 'Error hashing the password' });
            }


            console.log('Inserting the following data:', { name, email, phone, hashedPassword });

            const query = 'INSERT INTO clients (name, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())';
            db.query(query, [name, email, phone, hashedPassword], (err, result) => {
                if (err) {
                    console.error('MySQL error during insertion:', err.message);
                    return res.status(500).json({ success: false, message: 'Error inserting data into clients', error: err.message });
                }

                return res.status(201).json({ success: true, message: 'Client registered successfully' });
            });
        });
    });
});


app.get('/api/cleaners/nearby', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const query = `
        SELECT id, name, email, phone, status, city, price, latitude, longitude,
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
        FROM cleaners
        HAVING distance < 50
        ORDER BY distance
    `;

    db.query(query, [latitude, longitude, latitude], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/cleaners/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM cleaners WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Server error' });
            return;
        }

        if (results.length === 1) {
            const cleaner = results[0];
            bcrypt.compare(password, cleaner.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    res.status(500).json({ success: false, message: 'Server error' });
                    return;
                }

                if (isMatch) {
                    res.json({ success: true, cleanerId: cleaner.id });
                } else {
                    res.json({ success: false, message: 'Invalid credentials' });
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/api/clients/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM clients WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ success: false, message: 'Server error' });
            return;
        }

        if (results.length === 1) {
            const client = results[0];
            bcrypt.compare(password, client.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    res.status(500).json({ success: false, message: 'Server error' });
                    return;
                }

                if (isMatch) {
                    res.json({ success: true, clientId: client.id });
                } else {
                    res.json({ success: false, message: 'Invalid credentials' });
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.get('/api/admin/payments', (req, res) => {
    const query = 'SELECT id, method, status FROM paiements';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }

        res.json(results);
    });
});


app.post('/api/admin/add-payment', (req, res) => {
    const { method, status } = req.body;

    if (!method || !status) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const query = 'INSERT INTO paiements (method, status) VALUES (?, ?)';
    db.query(query, [method, status], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du paiement:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }

        res.json({ success: true, message: 'Mode de paiement ajouté avec succès', payment: { id: results.insertId, method, status } });
    });
});

app.put('/api/admin/update-payment/:id', (req, res) => {
    const { id } = req.params;
    const { method, status } = req.body;

    if (!method || !status) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const query = 'UPDATE paiements SET method = ?, status = ? WHERE id = ?';
    db.query(query, [method, status, id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du paiement:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }

        res.json({ success: true, message: 'Mode de paiement mis à jour avec succès' });
    });
});

app.get('/api/admin/cities', (req, res) => {
    const query = 'SELECT id, name, latitude, longitude FROM cities';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des villes:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }
        res.json(results);
    });
});


app.post('/api/admin/add-city', (req, res) => {
    const { name, latitude, longitude } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
    }

    const query = 'INSERT INTO cities (name, latitude, longitude) VALUES (?, ?, ?)';
    db.query(query, [name, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la ville:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }
        res.json({ success: true, message: 'Ville ajoutée avec succès', city: { id: result.insertId, name, latitude, longitude } });
    });
});


app.put('/api/admin/update-city/:id', (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
    }

    const query = 'UPDATE cities SET name = ?, latitude = ?, longitude = ? WHERE id = ?';
    db.query(query, [name, latitude, longitude, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de la ville:', err);
            return res.status(500).json({ success: false, message: 'Erreur du serveur' });
        }
        res.json({ success: true, message: 'Ville mise à jour avec succès' });
    });
});


app.get('/api/admin/clients', (req, res) => {
    const query = `
        SELECT id, name, phone AS mobile, email, password
        FROM clients;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});



app.get('/api/admin/cleaners', (req, res) => {
    const query = 'SELECT id, name, phone AS mobile, email, city, price, latitude, longitude FROM cleaners';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cleaners:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.post('/api/offers', (req, res) => {
    const { price, description, cleaner_id, clientId } = req.body;

    if (!price || !description || !cleaner_id || !clientId) {
        return res.status(400).json({ success: false, message: 'Price, description, cleaner_id, and clientId are required' });
    }

    const query = 'INSERT INTO offers (price, description, cleaner_id, clientId, status, decision_date) VALUES (?, ?, ?, ?, "pending", NOW())';
    db.query(query, [price, description, cleaner_id, clientId], (err, results) => {
        if (err) {
            console.error('Error adding offer:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Offer added successfully' });
    });
});

app.get('/api/offers', (req, res) => {
    const clientId = req.query.clientId;
    const cleanerId = req.query.cleanerId;

    if (!clientId && !cleanerId) {
        return res.status(400).json({ success: false, message: 'Client ID or Cleaner ID is required' });
    }

    let query = '';
    let queryParams = [];


    if (clientId) {
        query = 'SELECT * FROM offers WHERE clientId = ?';
        queryParams = [clientId];
    } else if (cleanerId) {
        query = 'SELECT * FROM offers WHERE cleaner_id = ?';
        queryParams = [cleanerId];
    }


    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching offers:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.get('/api/admin/offers', (req, res) => {
    const query = 'SELECT * FROM offers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching offers:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.post('/api/offers/accept', (req, res) => {
    const { id } = req.body;
    const query = `
        UPDATE offers 
        SET status = 'in-progress', decision_date = NOW() 
        WHERE id = ?;
    `;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error updating offer status to in-progress:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Offer accepted and set to in-progress' });
    });
});



app.post('/api/offers/reject', (req, res) => {
    const { id } = req.body;
    const decisionDate = new Date().toISOString();

    console.log('Reject Offer Request:', { id, decisionDate });

    const query = 'UPDATE offers SET status = ?, decision_date = ? WHERE id = ?';
    db.query(query, ['rejected', decisionDate, id], (err, results) => {
        if (err) {
            console.error('Error updating offer:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        console.log('Offer rejected successfully:', results);
        res.json({ success: true, message: 'Offer rejected successfully' });
    });
});


app.post('/api/offers/finish', (req, res) => {
    const { id } = req.body;
    const query = `
        UPDATE offers 
        SET status = 'completed', decision_date = NOW() 
        WHERE id = ? AND status = 'in-progress';
    `;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error updating offer status to completed:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Offer marked as completed' });
    });
});


app.post('/api/cleaner/update', (req, res) => {
    const { id, email, password, phone, price } = req.body;
    db.query('UPDATE cleaners SET email = ?, password = ?, phone = ?, price = ? WHERE id = ?', [email, password, phone, price, id], (err, result) => {
        if (err) {
            console.error('Error updating cleaner data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Cleaner information updated successfully' });
    });
});


app.get('/api/cleaner/:id', (req, res) => {
    const cleanerId = req.params.id;
    db.query('SELECT * FROM cleaners WHERE id = ?', [cleanerId], (err, results) => {
        if (err) {
            console.error('Error fetching cleaner data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.length === 1) {
            res.json({ success: true, cleaner: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Cleaner not found' });
        }
    });
});


app.get('/api/cleaners/:id/contact', (req, res) => {
    const cleanerId = req.params.id;
    const query = 'SELECT name, phone, email FROM cleaners WHERE id = ?';
    db.query(query, [cleanerId], (err, results) => {
        if (err) {
            console.error('Error fetching cleaner details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Cleaner not found' });
        }
        res.json(results[0]);
    });
});



app.post('/api/admin/add-cleaner', (req, res) => {
    const { name, mobile, email, city, price, latitude, longitude } = req.body;

    if (!name || !mobile || !email || !city || !price || !latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = 'INSERT INTO cleaners (name, phone, email, city, price, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Active")';
    db.query(query, [name, mobile, email, city, price, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error adding cleaner:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const newCleaner = { id: result.insertId, name, mobile, email, city, price, latitude, longitude, status: 'Active' };
        res.json({ success: true, cleaner: newCleaner });
    });
});

app.get('/api/clients/:clientId', (req, res) => {
    const clientId = req.params.clientId;

    const query = 'SELECT name, phone, email FROM clients WHERE id = ?';
    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error fetching client details:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        res.json(results[0]);
    });
});



app.post('/api/client/update', (req, res) => {
    const { id, email, password, phone } = req.body;
    db.query('UPDATE clients SET email = ?, password = ?, phone = ? WHERE id = ?', [email, password, phone, id], (err, result) => {
        if (err) {
            console.error('Error updating client data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Client information updated successfully' });
    });
});

app.get('/api/client/:id', (req, res) => {
    const clientId = req.params.id;
    db.query('SELECT * FROM clients WHERE id = ?', [clientId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.length === 1) {
            res.json({ success: true, client: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Client not found' });
        }
    });
});


app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;


    const sql = 'INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).send('Server error');
        }
        console.log('Form data inserted:', result);
        return res.status(200).send('Form data successfully submitted');
    });
});

app.get('/api/contacts', (req, res) => {
    const sql = 'SELECT * FROM contact_form ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).send('Server error');
        }
        return res.status(200).json(results);
    });
});

app.get('/api/admin/transactions', (req, res) => {
    const query = `
        SELECT 
            MONTHNAME(decision_date) AS month, 
            COUNT(id) AS total_offers
        FROM 
            offers 
        WHERE 
            status IN ('accepted', 'completed')
        GROUP BY 
            month
        ORDER BY 
            MONTH(decision_date);
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transactions data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});
app.get('/api/admin/revenue', (req, res) => {
    const query = `
        SELECT 
            MONTHNAME(decision_date) AS month, 
            SUM(price) AS total_revenue
        FROM 
            offers
        WHERE 
            status IN ('accepted', 'completed')
        GROUP BY 
            month
        ORDER BY 
            MONTH(decision_date);
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching revenue data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});
app.get('/api/admin/cleaners-jobs', (req, res) => {
    const query = `
        SELECT 
            cleaners.name, 
            COUNT(offers.id) AS jobs_done
        FROM 
            offers 
        JOIN 
            cleaners ON offers.cleaner_id = cleaners.id
        WHERE 
            offers.status IN ('accepted', 'completed')
        GROUP BY 
            cleaners.name;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cleaners jobs data:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});
app.post('/api/reviews', (req, res) => {
    const { client_id, cleaner_id, review_text, rating } = req.body;

    if (!client_id || !cleaner_id || !rating || !review_text) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = `
        INSERT INTO reviews (client_id, cleaner_id, review_text, rating)
        VALUES (?, ?, ?, ?);
    `;

    db.query(query, [client_id, cleaner_id, review_text, rating], (err, results) => {
        if (err) {
            console.error('Error submitting review:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json({ success: true, message: 'Review submitted successfully' });
    });
});


app.get('/api/reviews', (req, res) => {
    const query = `
        SELECT reviews.review_text, reviews.rating, reviews.review_date 
        FROM reviews 
        ORDER BY review_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.get('/api/admin/client-reviews', (req, res) => {
    const cleanerId = req.query.cleanerId;

    if (!cleanerId) {
        return res.status(400).json({ success: false, message: 'Cleaner ID is required' });
    }

    const query = `
        SELECT 
            clients.name AS client, 
            reviews.review_text AS review, 
            reviews.rating, 
            reviews.review_date
        FROM 
            reviews
        JOIN 
            clients ON reviews.client_id = clients.id
        WHERE 
            reviews.cleaner_id = ?
        ORDER BY 
            reviews.review_date DESC;
    `;

    db.query(query, [cleanerId], (err, results) => {
        if (err) {
            console.error('Error fetching client reviews:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.get('/api/offers/current-jobs', (req, res) => {
    const cleanerId = req.query.cleanerId;

    const query = `
        SELECT * 
        FROM offers 
        WHERE cleaner_id = ? 
        AND status = 'in-progress';
    `;

    db.query(query, [cleanerId], (err, results) => {
        if (err) {
            console.error('Error fetching current jobs:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        res.json(results);
    });
});


app.get('/api/client/completed-jobs', (req, res) => {
    const clientId = req.query.clientId;
    console.log("Client ID:", clientId);

    const query = `
        SELECT offers.id, offers.description, offers.price, cleaners.name AS cleaner_name, cleaners.id AS cleaner_id
        FROM offers
        JOIN cleaners ON offers.cleaner_id = cleaners.id
        WHERE offers.clientId = ? AND offers.status = 'completed';
    `;

    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error fetching completed jobs:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No completed jobs found for this client' });
        }

        res.json(results);
    });
});






const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
