const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const dayjs = require('dayjs');

// Helper to compute spend in a category for a month
const spentInMonth = async (userId, category, month) => {
  const start = dayjs(month).startOf('month').toDate();
  const end = dayjs(month).endOf('month').toDate();
  const agg = await Transaction.aggregate([
    { $match: { user: userId, category, date: { $gte: start, $lte: end }, amount: { $lt: 0 } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return agg.length ? Math.abs(agg[0].total) : 0;
};

// @desc Set or update a budget
// @route POST /api/budgets
// @access Private
exports.setBudget = asyncHandler(async (req, res) => {
  const { category, month, limit } = req.body; // month format YYYY-MM

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month },
    { limit },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(budget);
});

// @desc Get budgets for month (with spent & percent)
// @route GET /api/budgets?month=YYYY-MM
// @access Private
exports.getBudgets = asyncHandler(async (req, res) => {
  const month = req.query.month || dayjs().format('YYYY-MM');
  const budgets = await Budget.find({ user: req.user._id, month });

  const enriched = await Promise.all(
    budgets.map(async (b) => {
      const spent = await spentInMonth(req.user._id, b.category, month);
      const percent = ((spent / b.limit) * 100).toFixed(1);
      return { ...b.toObject(), spent, percent: Number(percent) };
    })
  );

  res.json(enriched);
});

// @desc Delete a budget
// @route DELETE /api/budgets/:id
// @access Private
exports.deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  res.json({ message: 'Budget removed' });
});
