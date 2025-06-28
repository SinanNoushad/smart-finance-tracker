const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const { generateMockTransactions } = require('../utils/mockData');

// @desc    Connect to a mock bank account
// @route   POST /api/bank/connect
// @access  Private
exports.connectBank = asyncHandler(async (req, res) => {
  // In a real application, this would involve secure OAuth flow with a bank API (e.g., Plaid)
  // For this mock implementation, we'll just simulate a successful connection
  // and generate initial transactions.

  const userId = req.user._id; // User ID from auth middleware
  const { bankName, accountNumber } = req.body; // Mock bank details

  if (!bankName || !accountNumber) {
    return res.status(400).json({ message: 'Please provide bank name and account number' });
  }

  // Simulate fetching initial transactions for the last 12 months
  const mockTransactions = generateMockTransactions(userId, 12); // Generate for 12 months

  // Save mock transactions to the database, associating them with the user
  const transactionsToSave = mockTransactions.map(t => ({
    ...t,
    userId: userId,
    bankAccountId: 'mock-bank-account-id-' + Math.random().toString(36).substring(7), // Unique mock ID
    // Add a flag to indicate it's a mock transaction
    isMock: true, 
  }));

  await Transaction.insertMany(transactionsToSave);

  res.status(200).json({
    message: `Successfully connected to ${bankName} and fetched initial transactions.`,
    bankAccount: {
      id: 'mock-bank-account-id-' + Math.random().toString(36).substring(7),
      name: bankName,
      accountNumber: accountNumber,
      connectedDate: new Date(),
    },
    transactionsFetched: transactionsToSave.length,
  });
});

// @desc    Fetch new transactions from a mock bank account
// @route   GET /api/bank/transactions
// @access  Private
exports.fetchBankTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // In a real scenario, you'd pass a cursor or last fetched date to the bank API
  // For mock, we'll just generate a few new transactions
  const newMockTransactions = generateMockTransactions(userId, 1, 5); // Generate 5 new transactions for the current month

  if (newMockTransactions.length > 0) {
    const transactionsToSave = newMockTransactions.map(t => ({
      ...t,
      userId: userId,
      bankAccountId: 'mock-bank-account-id-' + Math.random().toString(36).substring(7),
      isMock: true,
    }));
    await Transaction.insertMany(transactionsToSave);
  }

  res.status(200).json({
    message: 'Fetched new transactions from mock bank.',
    newTransactionsCount: newMockTransactions.length,
    transactions: newMockTransactions,
  });
});