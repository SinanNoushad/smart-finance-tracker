import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';

const PAGE_SIZE = 20;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    const { data } = await api.get(`/transactions?page=${pageNum}&limit=${PAGE_SIZE}`);
    if (pageNum === 1) setTransactions(data.transactions);
    else setTransactions((prev) => [...prev, ...data.transactions]);
    setPages(data.pages);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          const next = page + 1;
          setPage(next);
          fetchTransactions(next);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, loading, page, pages]);

  const handleImportMock = async () => {
    await api.post('/transactions/import/mock');
    setPage(1);
    fetchTransactions(1);
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Transactions</h3>
        <button className="btn btn-secondary btn-sm" onClick={handleImportMock}>
          Import Mock
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="text-end">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className="text-end">
                {t.amount < 0 ? '-' : ''}₹{Math.abs(t.amount).toFixed(2)}
              </td>
              <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
      <div ref={loader} />
    </div>
  );
};

export default Transactions;
