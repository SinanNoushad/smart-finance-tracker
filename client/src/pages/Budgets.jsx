import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import dayjs from 'dayjs';

const Budgets = () => {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('food');
  const [limit, setLimit] = useState('');

  const fetchBudgets = async () => {
    const { data } = await api.get(`/budgets?month=${month}`);
    setBudgets(data);
  };

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/budgets', { category, month, limit: Number(limit) });
    setLimit('');
    fetchBudgets();
  };

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    fetchBudgets();
  };

  return (
    <div>
      <h3>Budgets</h3>
      <div className="d-flex align-items-center mb-3">
        <input
          type="month"
          className="form-control me-2"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
      <form className="row g-2 mb-4" onSubmit={handleAdd}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            type="number"
            min="0"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            Save
          </button>
        </div>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th className="text-end">Spent</th>
            <th className="text-end">Limit</th>
            <th className="text-end">% Used</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b._id} className={b.percent > 100 ? 'table-danger' : b.percent > 80 ? 'table-warning' : ''}>
              <td>{b.category}</td>
              <td className="text-end">₹{b.spent.toFixed(2)}</td>
              <td className="text-end">₹{b.limit.toFixed(2)}</td>
              <td className="text-end">{b.percent}%</td>
              <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Budgets;
