const express = require('express');
const { addFood, updateFood, deleteFood, searchFood, getAllFoodItems, getFoodById } = require('../controllers/foodController');
const authenticateJWT = require('../middleware/authenticateJwt');

const router = express.Router();

// Add a new food item
router.post('/add-food', authenticateJWT, addFood);

// Update an existing food item
router.put('/:id', authenticateJWT, updateFood);

// Delete a food item
router.delete('/:id', authenticateJWT, deleteFood);

// Search for food items
router.get('/search', searchFood);

// fetch all food
router.get('/', getAllFoodItems);

// Fetch a single food item by ID
router.get('/:id', getFoodById);

module.exports = router;
