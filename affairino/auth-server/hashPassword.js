const bcrypt = require('bcrypt');

// Plain text password that was inserted into the database
const plainPassword = 'simplepassword'; // Replace this with the password you want to hash

// Hash the password
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
        // You can copy the hashed password from the console output
    }
});
