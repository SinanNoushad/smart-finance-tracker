const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const createReportPdf = require('../utils/createReportPdf');
const dayjs = require('dayjs');

// @desc Generate monthly PDF report
// @route GET /api/reports/pdf?month=YYYY-MM
// @access Private
exports.getMonthlyReportPdf = asyncHandler(async (req, res) => {
  const month = req.query.month || dayjs().format('YYYY-MM');
  const start = dayjs(month).startOf('month').toDate();
  const end = dayjs(month).endOf('month').toDate();

  const transactions = await Transaction.find({ user: req.user._id, date: { $gte: start, $lte: end } }).sort({ date: 1 });

  // Compute summary
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));
  const summary = { totalIncome, totalExpenses, net: totalIncome - totalExpenses };

  const pdfBuffer = await createReportPdf(transactions, summary, month);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="report-${month}.pdf"`,
    'Content-Length': pdfBuffer.length,
  });
  res.send(pdfBuffer);
});
