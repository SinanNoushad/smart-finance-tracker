const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const { categories } = require('../utils/mockData'); // Import categories from mockData

const categorizeTransaction = (description, amount) => {
  const desc = description.toLowerCase();

  // Determine type based on amount
  const type = amount > 0 ? 'income' : 'expense';

  // Find the main category and subcategory
  for (const cat of categories) {
    if (cat.type === type) {
      if (cat.subcategories && Array.isArray(cat.subcategories)) {
        for (const subcat of cat.subcategories) {
          const subcatName = typeof subcat === 'object' ? subcat.name : subcat;
          if (subcatName.toLowerCase().includes(desc) || desc.includes(subcatName.toLowerCase())) {
            return { category: cat.name, subcategory: subcatName, type };
          }
        }
      }
      // If no specific subcategory matches, but main category name matches description
      if (cat.name.toLowerCase().includes(desc) || desc.includes(cat.name.toLowerCase())) {
        return { category: cat.name, subcategory: null, type };
      }
    }
  }

  // Fallback for expenses if no specific category matches
  if (type === 'expense') {
    return { category: 'Others', subcategory: null, type: 'expense' };
  }
  // Fallback for income if no specific category matches
  return { category: 'Uncategorized Income', subcategory: null, type: 'income' };
};

// @desc    Fetch transactions (paginated)
// @route   GET /api/transactions?page=1&limit=20
// @access  Private
exports.getTransactions = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;

  const count = await Transaction.countDocuments({ userId: req.user._id });
  const transactions = await Transaction.find({ userId: req.user._id })
    .sort({ date: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ transactions, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = asyncHandler(async (req, res) => {
  const { date, description, amount, category, subcategory, type, isRecurring } = req.body;
  
  // Auto-categorize if not provided
  const categorizedData = category ? { category, subcategory, type } : categorizeTransaction(description, amount);

  const transaction = await Transaction.create({
    userId: req.user._id,
    date,
    description,
    amount,
    category: categorizedData.category,
    subcategory: categorizedData.subcategory,
    type: categorizedData.type,
    isRecurring: isRecurring || false,
  });

  res.status(201).json(transaction);
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const updates = req.body;
  if (updates.description || updates.amount) {
    const desc = updates.description || transaction.description;
    const amt = updates.amount !== undefined ? updates.amount : transaction.amount;
    const categorized = categorizeTransaction(desc, amt);
    updates.category = updates.category || categorized.category;
    updates.subcategory = updates.subcategory || categorized.subcategory;
    updates.type = updates.type || categorized.type;
  }

  const updated = await Transaction.findByIdAndUpdate(transaction._id, updates, { new: true });
  res.json(updated);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ message: 'Transaction removed' });
});

// @desc    Import mock transactions
// @route   POST /api/transactions/import/mock
// @access  Private
exports.importMockTransactions = asyncHandler(async (req, res) => {
  // Placeholder for actual implementation
  res.status(200).json({ message: 'Mock transactions import initiated (placeholder)' });
});
