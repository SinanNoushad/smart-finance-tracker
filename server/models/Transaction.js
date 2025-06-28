const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }, // positive for income, negative for expense
    category: { type: String, required: true },
    subcategory: { type: String },
    type: { type: String, enum: ['income', 'expense'], required: true },
    isRecurring: { type: Boolean, default: false },
    bankAccountId: { type: String }, // To link to a mock or real bank account
    isMock: { type: Boolean, default: false }, // To identify mock transactions
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
