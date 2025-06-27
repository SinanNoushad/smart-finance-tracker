const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper function to draw horizontal line
const drawLine = (doc, y, width = 500) => {
  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(50, y)
     .lineTo(50 + width, y)
     .stroke();
};

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
      const doc = new PDFDocument({ 
        margin: 40,
        bufferPages: true,
        autoFirstPage: false
      });
      
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add first page
      doc.addPage({
        size: 'A4',
        margin: 50
      });

      // Header - Draw without logo
      doc.fillColor('#2c3e50')
         .fontSize(20)
         .text('SMART FINANCE TRACKER', 50, 50, { align: 'left' })
         .fontSize(10)
         .text('123 Finance Street', 50, 75, { align: 'left' })
         .text('Mumbai, 400001', 50, 90, { align: 'left' })
         .text('Report Period: ' + dayjs(month).format('MMMM YYYY'), 50, 150, { align: 'left' })
         .text('Generated: ' + dayjs().format('DD MMM YYYY, hh:mm A'), 50, 165, { align: 'left' })
         .moveDown();

      // Add a line under the header
      drawLine(doc, 185);
      
      // Summary Section
      const summaryTop = 200;
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('FINANCIAL SUMMARY', 50, summaryTop, { align: 'left', underline: true });
      
      // Summary Box
      const boxY = summaryTop + 30;
      const boxWidth = 220;
      const boxHeight = 100;
      const boxX = 50;
      
      // Draw summary box with shadow
      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 5)
         .fill('#f8f9fa')
         .stroke('#e9ecef');
      
      // Add summary items
      doc.fontSize(12)
         .fillColor('#2c3e50')
         .text('Total Income:', boxX + 15, boxY + 20)
         .text('Total Expenses:', boxX + 15, boxY + 45)
         .text('Net Balance:', boxX + 15, boxY + 70)
         .font('Helvetica-Bold')
         .text(formatCurrency(summary.totalIncome), boxX + 140, boxY + 20, { align: 'right' })
         .text(formatCurrency(summary.totalExpenses), boxX + 140, boxY + 45, { align: 'right' })
         .text(formatCurrency(summary.net), boxX + 140, boxY + 70, { 
           align: 'right',
           fillColor: summary.net >= 0 ? '#2ecc71' : '#e74c3c'
         });
      
      // Transactions Section
      const transactionsTop = summaryTop + 150;
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .text('TRANSACTIONS', 50, transactionsTop, { align: 'left', underline: true });
      
      // Table Header
      const tableTop = transactionsTop + 30;
      doc.fontSize(10)
         .fillColor('#ffffff')
         .roundedRect(50, tableTop, 500, 20, 3)
         .fill('#34495e')
         .fillColor('#ffffff')
         .text('DATE', 60, tableTop + 5, { width: 70, align: 'left' })
         .text('DESCRIPTION', 140, tableTop + 5, { width: 180, align: 'left' })
         .text('CATEGORY', 340, tableTop + 5, { width: 100, align: 'left' })
         .text('AMOUNT', 450, tableTop + 5, { width: 90, align: 'right' });
      
      // Table Rows
      let y = tableTop + 25;
      transactions.forEach((transaction, i) => {
        // Check if we need a new page
        if (y > 750) {
          doc.addPage();
          y = 100; // Reset Y position for new page
          
          // Add header for new page
          doc.fontSize(10)
             .fillColor('#34495e')
             .text('CONTINUED...', 50, 70, { align: 'left' });
             
          // Draw table header again
          doc.fillColor('#ffffff')
             .roundedRect(50, 80, 500, 20, 3)
             .fill('#34495e')
             .fillColor('#ffffff')
             .text('DATE', 60, 85, { width: 70, align: 'left' })
             .text('DESCRIPTION', 140, 85, { width: 180, align: 'left' })
             .text('CATEGORY', 340, 85, { width: 100, align: 'left' })
             .text('AMOUNT', 450, 85, { width: 90, align: 'right' });
             
          y = 105; // Set Y position after header
        }
        
        // Alternate row colors
        if (i % 2 === 0) {
          doc.fillColor('#f8f9fa')
             .rect(50, y - 5, 500, 20)
             .fill();
        }
        
        // Draw row content
        doc.fillColor('#2c3e50')
           .font('Helvetica')
           .text(dayjs(transaction.date).format('DD MMM'), 60, y, { width: 70, align: 'left' })
           .text(transaction.description, 140, y, { width: 180, align: 'left', lineGap: 5 })
           .text(transaction.category, 340, y, { width: 100, align: 'left' })
           .font(transaction.amount >= 0 ? 'Helvetica-Bold' : 'Helvetica')
           .fillColor(transaction.amount >= 0 ? '#2ecc71' : '#e74c3c')
           .text(formatCurrency(transaction.amount), 450, y, { width: 90, align: 'right' });
        
        y += 20;
      });
      
      // Add footer with page numbers
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .fillColor('#7f8c8d')
           .text(
             `Page ${i + 1} of ${pageCount}`,
             50,
             800,
             { align: 'center', width: 500 }
           );
      }
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = createReportPdf;
