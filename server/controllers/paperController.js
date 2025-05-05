const QuestionPaper = require('../models/QuestionPaper');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { validationResult } = require('express-validator');

// Get all question papers with pagination, search and filters
exports.getQuestionPapers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, subject, year, semester } = req.query;
    
    // Build query filters
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (subject) {
      query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (semester) {
      query.semester = { $regex: new RegExp(`^${semester}$`, 'i') };
    }
    
    // Execute query with pagination
    const papers = await QuestionPaper.find(query)
      .populate('uploadedBy', '_id name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();
      
    // Get total count for pagination
    const count = await QuestionPaper.countDocuments(query);
    
    res.json({
      papers,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get question paper by ID
exports.getQuestionPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id)
      .populate('uploadedBy', '_id name email avatar university');
      
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    res.json(paper);
  } catch (error) {
    console.error('Get paper by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Delete question paper by ID
exports.deleteQuestionPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
  
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
  
    const imageUrl = paper.fileUrl;
  
    if (imageUrl) {
      const parts = imageUrl.split('/');
      const fileNameWithExt = parts[parts.length - 1]; // "qotypvytdljvpr2ostyw.png"
      const folderName = parts[parts.length - 2];      // "question_papers"
  
      const fileName = fileNameWithExt.split('.')[0];  // "qotypvytdljvpr2ostyw"
      const publicId = `${folderName}/${fileName}`;    // "question_papers/qotypvytdljvpr2ostyw"
      
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }
  
    // Then delete the document from MongoDB
    await QuestionPaper.findByIdAndDelete(req.params.id);
  
    res.json({ message: 'Question paper and image deleted successfully' });
  } catch (error) {
    console.error('Delete paper with image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};  

// Get question paper by User ID
exports.getQuestionPaperByUserId = async (req, res) => {
    try {
      const userPaper = await QuestionPaper.find({uploadedBy: req.params.uploadedById})
        .populate('uploadedBy', '_id name email avatar university');
        
      if (!userPaper) {
        return res.status(404).json({ message: 'Question paper not found' });
      }
      
      res.json(userPaper);
    } catch (error) {
      console.error('Get paper by ID error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Upload new question paper
exports.uploadQuestionPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    // Upload file to Cloudinary
    const isPdf = req.file.mimetype === 'application/pdf';
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'question_papers',
      resource_type: isPdf ? 'raw' : 'auto'
    });
    
    // Remove local file after upload to Cloudinary
    fs.unlinkSync(req.file.path);
    
    const { title, description, subject, course, year, semester, university } = req.body;
    
    // Create new question paper
    const paper = new QuestionPaper({
      title,
      description,
      subject,
      course,
      year: parseInt(year),
      semester,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      uploadedBy: req.user._id,
      university: university || req.user.university
    });
    
    // Save paper to database
    await paper.save();
    
    res.status(201).json(paper);
  } catch (error) {
    console.error('Upload paper error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};


