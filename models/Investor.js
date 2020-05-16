/* eslint-disable func-names */
const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },

  investmentPreference: {
    type: String,
    trim: true
  },

  investmentAccountType: {
    type: String,
    trim: true
  },

  screenName: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

const Investor = mongoose.model('investor', investorSchema);

module.exports = Investor;
