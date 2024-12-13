const express = require('express');
const { placeOrder } = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authenticateJwt');


const router = express.Router();

router.post('/', authenticateJWT, placeOrder);

module.exports = router;