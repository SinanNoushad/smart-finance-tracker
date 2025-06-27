const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const dayjs = require('dayjs');

// @desc    Get dashboard summary (income vs expenses, category pie, monthly trend)
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = asyncHandler(async (req, res) => {
  console.log('Entering getDashboard function');
  try {
    const userId = req.user._id;
    console.log('Dashboard Request - User ID:', userId);

    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();

    // 1. Calculate Total Income and Expenses for the current month
    const incomeExpenseSummary = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const totalIncome = incomeExpenseSummary[0]?.totalIncome || 0;
    const totalExpenses = Math.abs(incomeExpenseSummary[0]?.totalExpenses || 0); // Ensure expenses are positive for display
    const net = totalIncome - totalExpenses;

    // 2. Aggregate Monthly Trends (last 6 months including current)
    const sixMonthsAgo = now.subtract(5, 'month').startOf('month').toDate(); // Start from 6 months ago

    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: sixMonthsAgo, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          Income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          Expenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: '%b %Y',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          Income: 1,
          Expenses: { $abs: '$Expenses' }, // Display expenses as positive
          net: { $subtract: ['$Income', { $abs: '$Expenses' }] }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 3. Aggregate Top Categories (Top 5 Expenses for current month)
    const topCategories = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'expense', // Focus on expenses for top categories
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: 1 } }, // Sort by amount (ascending for expenses as they are negative)
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: { $abs: '$totalAmount' } // Display as positive value
        }
      }
    ]);

    res.json({
      monthlyTrends,
      topCategories,
      totalIncome,
      totalExpenses,
      net,
    });

  } catch (error) {
    console.error('Dashboard Error in getDashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});
