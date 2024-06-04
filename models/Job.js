const { required } = require('joi');
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxLength: [30, 'Name is to long'],
      minLength: [1, 'Provide a company name'],
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      trim: true,
      maxLength: [30, 'Name is to long'],
      minLength: [1, 'Provide a position'],
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
