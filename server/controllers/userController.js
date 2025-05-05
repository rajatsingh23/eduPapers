const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const fs = require('fs');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Ensure user can only update their own profile unless admin
    if (req.user.role !== 'admin' && req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const { name, university } = req.body;
    
    // Find user and update basic fields
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (university) user.university = university;
    
    // Handle avatar upload if present
    if (req.file) {
      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_avatars',
        width: 300,
        crop: 'fill'
      });
      
      // Remove the local file after upload
      fs.unlinkSync(req.file.path);
      
      // Update user avatar URL
      user.avatar = result.secure_url;
    }
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      university: user.university,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
