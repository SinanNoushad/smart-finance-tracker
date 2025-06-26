const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');

/**
 * Generates a PDF as a Buffer containing a monthly finance report.
 * @param {Object[]} transactions Array of transactions for the month
 * @param {Object} summary { totalIncome, totalExpenses, net }
 * @param {String} month e.g. '2025-06'
 * @returns Buffer
 */
const createReportPdf = (transactions, summary, month) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Smart Finance Tracker - Monthly Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Month: ${month}`, { align: 'left' });
      doc.text(`Generated: ${dayjs().format('DD MMM YYYY HH:mm')}`);
      doc.moveDown();

      // Summary
      doc.fontSize(16).text('Summary', { underline: true });
      doc.fontSize(12);
      doc.text(`Total Income: ₹${summary.totalIncome.toFixed(2)}`);
      doc.text(`Total Expenses: ₹${summary.totalExpenses.toFixed(2)}`);
      doc.text(`Net: ₹${summary.net.toFixed(2)}`);
      doc.moveDown();

      // Transactions table header
      doc.fontSize(16).text('Transactions', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text('Date', 50, doc.y, { continued: true });
      doc.text('Description', 120, doc.y, { continued: true });
      doc.text('Category', 320, doc.y, { continued: true });
      doc.text('Amount', 450, doc.y);
      doc.moveDown(0.5);

      transactions.forEach((t) => {
        doc.text(dayjs(t.date).format('DD MMM'), 50, doc.y, { continued: true });
        doc.text(t.description, 120, doc.y, { continued: true });
        doc.text(t.category, 320, doc.y, { continued: true });
        doc.text(`₹${t.amount.toFixed(2)}`, 450, doc.y);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = createReportPdf;
