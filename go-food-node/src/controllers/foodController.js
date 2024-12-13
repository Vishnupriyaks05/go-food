const { addFood, updateFood, deleteFood, searchFood } = require('../models/foodModel');
const db = require('../config/db');

exports.addFood = async (req, res) => {
    try {
        console.    log('addFood API called')
        console.log('Request body:', req.body);
        const foodId = await addFood(req.body);
        console.log('Food successfully added with ID:', foodId);
        res.status(201).json({ message: 'Food added successfully', foodId });
    } catch (err) {
        console.error('Error in addFood API:', err.message);
        res.status(500).json({ message: 'Error adding food', error: err.message });
    }
};

// exports.updateFood = async (req, res) => {
//     try {
//         console.    log('updateFood API called')
//         console.log('Request body:', req.body);
//         await updateFood(req.params.id, req.body);
//         console.log('Food successfully Updated');
//         res.status(200).json({ message: 'Food updated successfully' });
//     } catch (err) {
//         console.error('Error updating food:', err);
//         res.status(500).json({ message: 'Error updating food', error: err.message });
//     }
// };

exports.updateFood = async (req, res) => {
    console.log("UpdateFood API called");
    console.log("ID:", req.params.id);
    console.log("Data received:", req.body);
  
    const id = req.params.id;
    const foodData = req.body;

    try {
        const result = await updateFood(id, foodData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Food item not found" });
        }

        res.status(200).json({ message: "Food updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the food item" });
    }
  };
  

  exports.deleteFood = async (req, res) => {
    try {
        console.log("Request Params:", req.params); // Log the params for debugging

        const { id } = req.params; // Destructure ID from params
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }

        const result = await db.query('DELETE FROM food_items WHERE id = ?', [id]);
        console.log("DB Query Result:", result); // Log DB query result

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error deleting food:', error); // Log the entire error object
        res.status(500).json({ message: 'Error deleting food', error: error.message });
    }
};


exports.searchFood = async (req, res) => {
    try {
        const { keyword } = req.query; // Extract 'keyword' from query params

        console.log("SearchFood API called with keyword:", keyword);

        if (!keyword) {
            return res.status(400).json({ message: "Keyword is required" });
        }

        // Call the model function to perform the search
        const results = await searchFood(keyword);

        if (!results.length) {
            return res.status(404).json({ message: "No food items found" });
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error in searchFood controller:", err.message);
        res.status(500).json({ message: "Error searching food", error: err.message });
    }
};


exports.getAllFoodItems = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM food_items');
        if (!rows.length) {
            console.warn('No food items found in the database');
        }
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching food items:', err.message);
        res.status(500).json({ message: 'Error fetching food items', error: err.message });
    }
};

exports.getFoodById = async (req, res) => {
    try {
        console.log("getFoodById API called");
        console.log("ID from params:", req.params.id);
        
        const { id } = req.params;

        const [rows] = await db.query('SELECT * FROM food_items WHERE id = ?', [id]);

        if (!rows.length) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Error fetching food by ID:', err.message);
        res.status(500).json({ message: 'Error fetching food item', error: err.message });
    }
};

