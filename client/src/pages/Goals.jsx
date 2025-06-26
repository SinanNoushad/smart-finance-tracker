import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import dayjs from 'dayjs';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchGoals = async () => {
    const { data } = await api.get('/goals');
    setGoals(data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/goals', { title, targetAmount: Number(targetAmount), dueDate });
    setTitle('');
    setTargetAmount('');
    setDueDate('');
    fetchGoals();
  };

  const handleDelete = async (id) => {
    await api.delete(`/goals/${id}`);
    fetchGoals();
  };

  return (
    <div>
      <h3>Financial Goals</h3>
      <form className="row g-2 mb-4" onSubmit={handleAdd}>
        <div className="col-md-4">
          <input className="form-control" placeholder="Goal Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="number"
            min="0"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            Add
          </button>
        </div>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th className="text-end">Saved</th>
            <th className="text-end">Target</th>
            <th className="text-end">Progress</th>
            <th>Due</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {goals.map((g) => {
            const percent = ((g.savedAmount / g.targetAmount) * 100).toFixed(1);
            return (
              <tr key={g._id}>
                <td>{g.title}</td>
                <td className="text-end">₹{g.savedAmount.toFixed(2)}</td>
                <td className="text-end">₹{g.targetAmount.toFixed(2)}</td>
                <td className="text-end">{percent}%</td>
                <td>{g.dueDate ? dayjs(g.dueDate).format('DD MMM YYYY') : '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(g._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Goals;
