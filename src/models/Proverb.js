const mongoose = require('mongoose');

const { proverbCategories } = require('../utils/types');

const ProverbSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A proverb must have a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'A proverb needs content'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'A proverb needs an author'],
      trim: true,
    },
    authorDesc: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A proverb must have a category'],
      enum: {
        values: proverbCategories,
        message: '{VALUE} is not supported',
      },
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

module.exports = mongoose.model('Proverb', ProverbSchema);
