const db = require('../config/db');

exports.getAdminByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
    return rows[0];
};
