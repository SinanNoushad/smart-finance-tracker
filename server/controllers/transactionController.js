const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// Simple keyword based categorization
const keywordCategories = {
  food: ['restaurant', 'cafe', 'dinner', 'lunch', 'mcdonald', 'pizza'],
  transport: ['uber', 'lyft', 'bus', 'train', 'fuel', 'gas'],
  shopping: ['amazon', 'mall', 'store', 'clothes'],
  salary: ['payroll', 'salary', 'income'],
};

const categorize = (description, amount) => {
  if (amount > 0) return 'income';
  const desc = description.toLowerCase();
  for (const [cat, keywords] of Object.entries(keywordCategories)) {
    if (keywords.some((k) => desc.includes(k))) return cat;
  }
  return 'others';
};

// @desc    Fetch transactions (paginated)
// @route   GET /api/transactions?page=1&limit=20
// @access  Private
exports.getTransactions = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;

  const count = await Transaction.countDocuments({ user: req.user._id });
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ date: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ transactions, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = asyncHandler(async (req, res) => {
  const { date, description, amount } = req.body;
  const category = req.body.category || categorize(description, amount);

  const transaction = await Transaction.create({
    user: req.user._id,
    date,
    description,
    amount,
    category,
  });

  res.status(201).json(transaction);
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const updates = req.body;
  if (updates.description || updates.amount) {
    const desc = updates.description || transaction.description;
    const amt = updates.amount !== undefined ? updates.amount : transaction.amount;
    updates.category = updates.category || categorize(desc, amt);
  }

  const updated = await Transaction.findByIdAndUpdate(transaction._id, updates, { new: true });
  res.json(updated);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ message: 'Transaction removed' });
});

// @desc    Import mock transactions (simulate bank sync)
// @route   POST /api/transactions/import/mock
// @access  Private
exports.importMockTransactions = asyncHandler(async (req, res) => {
  const mockData = [
    { date: new Date(), description: 'Starbucks Coffee', amount: -5.5 },
    { date: new Date(), description: 'Uber Ride', amount: -12.75 },
    { date: new Date(), description: 'Monthly Salary', amount: 2000 },
  ];

  const created = await Transaction.insertMany(
    mockData.map((t) => ({
      ...t,
      user: req.user._id,
      category: categorize(t.description, t.amount),
    }))
  );
  res.status(201).json({ imported: created.length });
});
