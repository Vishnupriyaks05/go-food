const bcrypt = require('bcrypt');

// Hash a password
exports.hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Compare a plaintext password with a hashed password
exports.comparePassword = async (plaintextPassword, hashedPassword) => {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
};
