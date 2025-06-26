const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // positive for income, negative for expense
    category: { type: String, required: true },
    account: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
