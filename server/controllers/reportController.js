const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const createReportPdf = require('../utils/createReportPdf');
const { generateMockTransactions, generateMockSummary } = require('../utils/mockData');
const dayjs = require('dayjs');

// @desc Generate monthly PDF report
// @route GET /api/reports/pdf?month=YYYY-MM&mock=true
// @access Private
exports.getMonthlyReportPdf = asyncHandler(async (req, res) => {
  try {
    const month = req.query.month || dayjs().format('YYYY-MM');
    const useMock = req.query.mock === 'true';
    
    let transactions, summary;
    
    if (useMock) {
      // Generate mock data
      transactions = generateMockTransactions(month);
      summary = generateMockSummary(transactions);
      console.log('Using mock data for PDF generation');
    } else {
      // Use real data from database
      const start = dayjs(month).startOf('month').toDate();
      const end = dayjs(month).endOf('month').toDate();
      
      transactions = await Transaction.find({ 
        user: req.user._id, 
        date: { $gte: start, $lte: end } 
      }).sort({ date: 1 }).lean();
      
      if (transactions.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No transactions found for the selected period',
          mockAvailable: true
        });
      }
      
      // Compute summary from real data
      const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpenses = Math.abs(transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0));
        
      summary = { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
    }
    
    // Generate PDF with the data
    const pdfBuffer = await createReportPdf(transactions, summary, month);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${month}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
