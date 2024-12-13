const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addUser, getUserByEmail, getAllUsers, updateUserById,  } = require('../models/userModel');
const db = require("../config/db");
const jwtConfig = require('../config/jwtConfig');

// userRegiser
exports.register = async (req, res) => {
    const { name, email, phone, age, gender, password } = req.body;

    console.log('Register API called with data:', { name, email, phone, age, gender });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await addUser({ name, email, phone, age, gender, password: hashedPassword });
        console.log('User registered successfully:', { name, email });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// userLogin
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log( "User Login attempt:", email ) // Log login attempt

//     // Run the query and log the result
//     const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);
//     console.log("Database query result:", rows);

//     if (!rows || rows.length === 0) {
//       console.log("No user found with email:", email);
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = rows[0];

//     // Compare the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if(!isMatch) {
//       console.log("Password mismatch for email:", email); // Log password mismatch
//       return res.status(401).json({message: "Invalid credentials"})
//     }

//     const token = jwt.sign(
//       {id: user.id, email: user.email},
//       process.env.JWT_Secret,
//       { expiresIn: "1h" }
//     );
//     console.log("Login successful for email:", email);
//   } catch (error) {
//     console.error("Error during login:", error.message); // Log error
//     res
//       .status(500)
//       .json({ message: "Error during login", error: error.message });
//   }
// }

// userLogin
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("User Login attempt:", email); // Log login attempt

    // Run the query and log the result
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Database query result:", rows);

    if (!rows || rows.length === 0) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch for email:", email); // Log password mismatch
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Use correct environment variable key
      { expiresIn: "1h" }
    );

    console.log("userToken:",token)

    console.log("Login successful for email:", email);

    // Send token and user info as a response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message); // Log error
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};



// fetch all users
exports.fetchAllUsers = async (req, res) => {
    try {
      const users = await getAllUsers();
      console.log('Fetched users:', users);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  };

// Fetch Profile
exports.fetchProfile = async (req, res) => {
  try {
    const userId = req.user.id; // The user ID is decoded from the JWT token
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send the user data as the response
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};


// fetch user by ID
exports.fetchUserById = async (req, res) => {
  const userId = req.params.id; // Extracting the user ID from the URL parameters
  console.log("Incoming request for user ID:", userId);
  try {
    const user = await getUserById(userId); // Calling the database function
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If no user found, return 404
    }
    res.json(user); // Send the user details as the response
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.fetchProfileByEmail = async (req, res) => {
  console.log("Incoming email parameter:", req.params.email);
  try {
      const email = req.params.email; // Get the email from the request parameters
      console.log("Fetching profile for email:", email);

      // Fetch the user profile by email
      const user = await getUserByEmail(email);

      if (!user) {
          console.log("User not found for email:", email);
          return res.status(404).json({ message: "User not found" });
      }

      console.log("Fetched user:", user);
      res.json(user); // Send the user data as the response
  } catch (error) {
      console.error("Error fetching profile by email:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// update user profile
// exports.updateUserProfile = async (req, res) => {
//   const userId = req.params.id;
//   const updatedData = req.body;

//   try {
//     const result = await updateUserById(userId, updatedData);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };


// update user profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  
  console.log('Received updated data:', updatedData); // Log incoming data

  // Validate that the required fields are provided
  if (!updatedData.name || !updatedData.email || !updatedData.phone || !updatedData.age || !updatedData.gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await updateUserById(userId, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Request body:', req.body);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};