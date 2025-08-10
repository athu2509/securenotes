const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notes for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    let query = { author: req.user._id };
    
    if (search) {
      query.$text = { $search: search };
    }

    const notes = await Note.find(query)
      .select('-encryptedContent') // Don't return content in list view
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
router.post('/', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('encryptedContent')
    .exists()
    .withMessage('Encrypted content is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, encryptedContent, tags = [] } = req.body;

    const note = new Note({
      title,
      encryptedContent,
      tags: tags.filter(tag => tag.trim()).slice(0, 10), // Max 10 tags
      author: req.user._id
    });

    await note.save();
    
    // Return note without encrypted content for list view
    const noteResponse = note.toObject();
    delete noteResponse.encryptedContent;
    
    res.status(201).json({
      message: 'Note created successfully',
      note: noteResponse
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('encryptedContent')
    .exists()
    .withMessage('Encrypted content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, encryptedContent, tags = [] } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      {
        title,
        encryptedContent,
        tags: tags.filter(tag => tag.trim()).slice(0, 10)
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Return note without encrypted content for list view
    const noteResponse = note.toObject();
    delete noteResponse.encryptedContent;

    res.json({
      message: 'Note updated successfully',
      note: noteResponse
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share note
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { expiresIn = 24 } = req.body; // hours
    
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Generate share token
    const shareToken = crypto.randomBytes(32).toString('hex');
    const shareExpiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);

    note.isShared = true;
    note.shareToken = shareToken;
    note.shareExpiresAt = shareExpiresAt;
    
    await note.save();

    res.json({
      message: 'Note sharing enabled',
      shareUrl: `${req.protocol}://${req.get('host')}/api/notes/shared/${shareToken}`,
      expiresAt: shareExpiresAt
    });
  } catch (error) {
    console.error('Share note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared note
router.get('/shared/:token', async (req, res) => {
  try {
    const note = await Note.findOne({
      shareToken: req.params.token,
      isShared: true,
      shareExpiresAt: { $gt: new Date() }
    }).populate('author', 'username');

    if (!note) {
      return res.status(404).json({ message: 'Shared note not found or expired' });
    }

    res.json({
      title: note.title,
      encryptedContent: note.encryptedContent,
      author: note.author.username,
      createdAt: note.createdAt,
      tags: note.tags
    });
  } catch (error) {
    console.error('Get shared note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
