const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  encryptedContent: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  isShared: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    default: null
  },
  shareExpiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for searching
noteSchema.index({ title: 'text', tags: 'text' });
noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ shareToken: 1 });

module.exports = mongoose.model('Note', noteSchema);
