require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // To parse URL-encoded requests

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user',  userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes)

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`); // Log the HTTP method and URL
    console.log('Request Query Parameters:', req.query);
    console.log('Request Body:', req.body); // Log the request body (for POST requests)
    next(); // Call the next middleware or route handler
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
