const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const crypto = require('crypto')
const nodemailer = require('nodemailer')

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
    });
    
    // Save user to database
    await user.save();
    
    // Create JWT
    const token = generateToken(user);
    
    // Set cookie with the token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      university: user.university,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(201).json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    
    // Create JWT
    const token = generateToken(user);
    
    // Set cookie with the token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      university: user.university,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json(userData);
  })(req, res, next);
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,            // must match cookie set during login
    sameSite: 'None',        // must match too
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


//Reset Password
exports.reset = async (req,res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    tokenExpiry: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

  user.password = password;
  user.resetToken = undefined;
  user.tokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password has been reset. You can now log in.' });
}

//forgot password
exports.forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetLink = `https://edupapers.onrender.com/reset-password?token=${token}`;
  
  // Use your real email service here
  await sendEmail(
    user.email,
    'Reset Your Password – EduPapers',
    `Hi,\n\nI'm Rajat from EduPapers. You recently requested to reset your password.\n\nPlease click the link below to set a new password:\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n\nBest regards,\nRajat\nEduPapers Team`
  );
  
  
  res.json({ message: 'Check your email for reset link' });
};

async function sendEmail(to, subject, text) {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for 587
        auth: {
          user: 'rs2382001@gmail.com',
          pass: process.env.APP_PASS
        }
  });
  await transporter.sendMail({ from: 'rs2382001@gmail.com', to, subject, text });
}

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
