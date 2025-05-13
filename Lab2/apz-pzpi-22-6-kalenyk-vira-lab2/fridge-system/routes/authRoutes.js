const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController'); // Переконайтеся, що ці функції існують

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;