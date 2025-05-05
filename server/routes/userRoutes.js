const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get user profile
router.get('/:id', userController.getUserProfile);

// Update user profile
router.put('/:id', 
  authenticateUser,
  upload.single('avatar'),
  [
    check('name', 'Name cannot be empty').optional().not().isEmpty(),
    check('university', 'University cannot be empty').optional().not().isEmpty()
  ],
  userController.updateUserProfile
);

module.exports = router;
