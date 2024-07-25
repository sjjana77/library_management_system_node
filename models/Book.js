const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Book', bookSchema);
