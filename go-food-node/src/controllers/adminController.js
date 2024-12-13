const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// admin register
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Registering admin:", name, email); // Log the request data

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin details into the database
    const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
    await db.execute(sql, [name, email, hashedPassword]);

    console.log("Admin registered successfully!"); // Log success
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error.message); // Log error
    res
      .status(500)
      .json({ message: "Error registering admin", error: error.message });
  }
};

// admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Admin login attempt:", email); // Log login attempt

    // Run the query and log the result
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);
    console.log("Database query result:", rows);

    if (!rows || rows.length === 0) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("Password mismatch for email:", email); // Log password mismatch
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Login successful for email:", email); // Log successful login
    console.log('Generated token:', token);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error.message); // Log error
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin };
