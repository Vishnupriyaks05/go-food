const db = require('../config/db');

exports.placeOrder = async (req, res) => {
    const { food_item_id, quantity } = req.body;
    const userId = req.user.id; // Assuming the logged-in user ID is stored in req.user by a JWT middleware

    try {
        console.log("place order called")
        // Get the price of the food item
        const [foodRows] = await db.query('SELECT price FROM food_items WHERE id = ?', [food_item_id]);
        if (foodRows.length === 0) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const foodPrice = foodRows[0].price;
        const totalPrice = foodPrice * quantity;

        // Insert the order into the database
        const [result] = await db.query(
            'INSERT INTO orders (user_id, food_item_id, quantity, total_price) VALUES (?, ?, ?, ?)',
            [userId, food_item_id, quantity, totalPrice]
        );

        console.log("Order placed Successfully",result)

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: result.insertId, 
            totalPrice 
        });
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ message: 'Error placing order', error: err.message });
    }
};
