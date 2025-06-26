import React, { useState } from 'react';
import api from '../utils/api';
import dayjs from 'dayjs';

const ReportPage = () => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/reports/pdf?month=${month}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h3>Monthly PDF Report</h3>
      <div className="d-flex align-items-center mb-3">
        <input type="month" className="form-control w-auto me-2" value={month} onChange={(e) => setMonth(e.target.value)} />
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
      <p>Select a month and click "Download PDF" to generate a detailed printable report of your transactions and summary.</p>
    </div>
  );
};

export default ReportPage;