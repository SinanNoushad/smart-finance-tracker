const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const dayjs = require('dayjs');

// @desc    Get dashboard summary (income vs expenses, category pie, monthly trend)
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Last 6 months start date
  const startSix = dayjs().subtract(5, 'month').startOf('month').toDate();

  // Aggregate pipeline
  const agg = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: startSix } } },
    {
      $facet: {
        incomeExpense: [
          {
            $group: {
              _id: {
                month: { $dateToString: { format: '%Y-%m', date: '$date' } },
              },
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
          { $sort: { '_id.month': 1 } },
        ],
        categoryBreakdown: [
          {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' },
            },
          },
        ],
        totals: [
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: {
                  $cond: [{ $gt: ['$amount', 0] }, '$amount', 0],
                },
              },
              totalExpenses: {
                $sum: {
                  $cond: [{ $lt: ['$amount', 0] }, '$amount', 0],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const data = agg[0];
  const incomeExpense = data.incomeExpense.map((m) => ({
    month: m._id.month,
    income: m.income,
    expenses: Math.abs(m.expenses),
  }));

  const categoryPie = data.categoryBreakdown.map((c) => ({
    category: c._id,
    amount: Math.abs(c.total),
  }));

  const totals = data.totals[0] || { totalIncome: 0, totalExpenses: 0 };

  res.json({
    incomeExpense,
    categoryPie,
    totalIncome: totals.totalIncome,
    totalExpenses: Math.abs(totals.totalExpenses),
    net: totals.totalIncome + totals.totalExpenses, // expenses negative
  });
});
