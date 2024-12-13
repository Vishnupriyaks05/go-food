const db = require('../config/db');

// add user
exports.addUser = async (userData) => {
    const { name, email, phone, age, gender, password } = userData;
    await db.query('INSERT INTO users (name, email, phone, age, gender, password) VALUES (?, ?, ?, ?, ?, ?)', 
                   [name, email, phone, age, gender, password]);
};

// het user by email
exports.getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT id, name, email, phone, age, gender FROM users WHERE email = ?', [email]);
    return rows[0];
};

// get all users
exports.getAllUsers = async () => {
    try {
        const [rows] = await db.query("SELECT id, name, email, phone, age, gender FROM users");
        console.log("Users fetched from DB:", rows);
        return rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
  };

 
// get user by id  
exports.getUserById = async (userId) => {
    const [rows] = await db.query('SELECT id, name, email, phone, age, gender FROM users WHERE id = ?', [userId]);
    return rows[0]; // Assuming the user exists
};

// // Update user by ID
// exports.updateUserById = async (userId, updatedData) => {
//     const { name, email, phone, age, gender } = updatedData;
//     const result = await db.query('UPDATE users SET name = ?, email = ?, phone = ?, age = ?, gender = ? WHERE id = ?', 
//                                  [name, email, phone, age, gender, userId]);
//     return result;
//   };

// Update user by ID
exports.updateUserById = async (userId, updatedData) => {
    const { name, email, phone, age, gender } = updatedData;
    // Check for null values before the update query
    if (!name || !email || !phone || !age || !gender) {
      throw new Error('Invalid data: All fields must be filled');
    }
  
    const result = await db.query('UPDATE users SET name = ?, email = ?, phone = ?, age = ?, gender = ? WHERE id = ?', 
                                  [name, email, phone, age, gender, userId]);
    return result;
  };