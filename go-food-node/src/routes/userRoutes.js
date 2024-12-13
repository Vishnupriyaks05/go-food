const express = require('express');
const { register, login, fetchAllUsers, fetchUserById, fetchProfileByEmail, updateUserProfile } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJwt');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.put('/reset-password', authenticateJWT, resetPassword);
router.get("/users", authenticateJWT, fetchAllUsers);
router.get('/:id', authenticateJWT, fetchUserById);
router.get('/profile/:email', authenticateJWT, fetchProfileByEmail);
router.put('/users/:id', authenticateJWT, updateUserProfile);

module.exports = router;
