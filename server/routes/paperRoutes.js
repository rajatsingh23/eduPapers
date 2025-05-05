const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const paperController = require('../controllers/paperController');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all question papers with pagination and filters
router.get('/', paperController.getQuestionPapers);

// Get question paper by ID
router.get('/:id', paperController.getQuestionPaperById);

//Delete question paper by ID
router.delete('/:id', paperController.deleteQuestionPaperById);

// Get question paper by ID
router.get('/user/:uploadedById', paperController.getQuestionPaperByUserId);



// Upload new question paper (protected route)
router.post('/', 
  authenticateUser,
  upload.single('file'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('course', 'Course is required').not().isEmpty(),
    check('year', 'Year is required').isNumeric(),
    check('semester', 'Semester is required').not().isEmpty()
  ],
  paperController.uploadQuestionPaper
);



module.exports = router;
