const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');


// Register a new user
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], authController.register);

// Login user
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

//forgot password
router.post('/forgot-password', authController.forgot);

router.post('/reset-password', authController.reset);


// Logout user
router.get('/logout', authController.logout);

// Get current user
router.get('/me', authenticateUser, authController.getCurrentUser);

module.exports = router;
