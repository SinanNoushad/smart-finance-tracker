import React, { useState } from 'react';
import api from '../utils/api';
import dayjs from 'dayjs';

const ReportPage = () => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      console.log('Initiating PDF download for month:', month);
      const response = await api.get(`/reports/pdf?month=${month}`, { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      console.log('Received response, status:', response.status);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
    } catch (err) {
      console.error('Download error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      let errorMessage = 'Failed to download report';
      if (err.response?.status === 401) {
        errorMessage = 'Please log in to download reports';
      } else if (err.response?.status === 404) {
        errorMessage = 'No data found for the selected period';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
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