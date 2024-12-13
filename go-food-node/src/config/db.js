const mysql = require('mysql2/promise');  // Use the promise version of mysql2
require('dotenv').config();  // to read the .env file

// Create a promise-based connection
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Optional: Log database user credentials (ensure not to log sensitive info in production)
console.log('DB_USER:', process.env.DB_USER);  
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);  

// Test the connection
connection.getConnection()
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.error('Error connecting to the database: ', err);
    });

// Export the connection pool for use in other parts of the application
module.exports = connection;
