const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MySQL Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'projectdb'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// List of cleaners and their passwords
const cleaners = [
    { id: 1, password: 'password1' },
    { id: 2, password: 'password2' },
    { id: 3, password: 'password3' },
    { id: 4, password: 'password4' },
    { id: 5, password: 'password5' },
    { id: 6, password: 'password6' }
];

// Function to update passwords
const updatePasswords = async () => {
    for (const cleaner of cleaners) {
        const hashedPassword = await bcrypt.hash(cleaner.password, 10);
        db.query('UPDATE cleaners SET password = ? WHERE id = ?', [hashedPassword, cleaner.id], (err, results) => {
            if (err) {
                console.error('Error updating password:', err);
            } else {
                console.log(`Password updated for cleaner ID ${cleaner.id}`);
            }
        });
    }
    db.end();
};

updatePasswords();
