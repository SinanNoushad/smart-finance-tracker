const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

// Helper to compute saved amount (income – expenses) so far
const computeSaved = async (userId) => {
  const agg = await Transaction.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        income: {
          $sum: {
            $cond: [{ $gt: ['$amount', 0] }, '$amount', 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $lt: ['$amount', 0] }, '$amount', 0],
          },
        },
      },
    },
  ]);
  if (!agg.length) return 0;
  return agg[0].income + agg[0].expenses; // expenses are negative
};

// @desc Create a goal
// @route POST /api/goals
// @access Private
exports.createGoal = asyncHandler(async (req, res) => {
  const { title, targetAmount, dueDate } = req.body;
  const savedAmount = await computeSaved(req.user._id);
  const goal = await Goal.create({ user: req.user._id, title, targetAmount, savedAmount, dueDate });
  res.status(201).json(goal);
});

// @desc Get user goals
// @route GET /api/goals
// @access Private
exports.getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.json(goals);
});

// @desc Update goal progress (recalculates savedAmount)
// @route PUT /api/goals/:id
// @access Private
exports.updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  const updates = req.body;
  if (updates.title) goal.title = updates.title;
  if (updates.targetAmount) goal.targetAmount = updates.targetAmount;
  if (updates.dueDate) goal.dueDate = updates.dueDate;

  // Recompute savedAmount from current transactions
  goal.savedAmount = await computeSaved(req.user._id);
  const updated = await goal.save();
  res.json(updated);
});

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json({ message: 'Goal removed' });
});
