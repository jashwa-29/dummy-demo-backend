const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/authController');

// Must be valid route handlers
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;