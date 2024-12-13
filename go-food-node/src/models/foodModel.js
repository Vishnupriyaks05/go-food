const db = require('../config/db');

exports.addFood = async (foodData) => {
    const { name, restaurant_name, image_url, location, price, category, rating } = foodData;
    const [result] = await db.query('INSERT INTO food_items (name, restaurant_name, image_url, location, price, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                                    [name, restaurant_name, image_url, location, price, category, rating]);
    return result.insertId;
};
  

exports.updateFood = async (id, foodData) => {
    console.log("Update Data:", foodData);

    const query = `
        UPDATE food_items
        SET name = ?, image_url = ?, restaurant_name = ?, location = ?, price = ?, category = ?, rating = ?
        WHERE id = ?;
    `;

    const params = [
        foodData.name,
        foodData.image_url,
        foodData.restaurant_name,
        foodData.location,
        foodData.price,
        foodData.category,
        foodData.rating,
        id,
    ];

    try {
        const [result] = await db.query(query, params);
        console.log("Update Result:", result);

        // Return the result to the calling function
        return result;
    } catch (error) {
        console.error("Error updating food:", error);
        throw error;
    }
};

// exports.deleteFood = async (id) => {
//     await db.query('DELETE FROM food_items WHERE id = ?', [id]);
// };
exports.deleteFood = async (req, res) => {
    try {
        console.log("Delete request received for ID:", req.params.id);

        if (!req.params.id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }

        const result = await db.query('DELETE FROM food_items WHERE id = ?', [req.params.id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error deleting food:', error.message);
        res.status(500).json({ message: 'Error deleting food', error: error.message });
    }
};

 
  

exports.searchFood = async (keyword) => {
    console.log("Reached searchFood model function with keyword:", keyword);

    const searchTerm = `%${keyword}%`; // Wrap keyword with '%' for partial matching

    const sql = `
        SELECT * FROM food_items 
        WHERE name LIKE ? 
        OR restaurant_name LIKE ? 
        OR category LIKE ?;
    `;

    const params = [searchTerm, searchTerm, searchTerm];

    try {
        // Execute the query
        const [results] = await db.query(sql, params);
        console.log("Search results:", results);

        return results; // Return results to the controller
    } catch (err) {
        console.error("Error in searchFood model function:", err.message);
        throw err; // Throw error back to the controller
    }
};