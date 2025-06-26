import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../utils/api';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  const fetchData = async () => {
    const { data } = await api.get('/dashboard');
    setSummary(data);

    // fetch budgets for current month for alerts
    const month = dayjs().format('YYYY-MM');
    const { data: budgets } = await api.get(`/budgets?month=${month}`);
    const alerts = budgets.filter((b) => b.percent > 100 || b.percent > 80);
    setBudgetAlerts(alerts);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!summary) return <p>Loading...</p>;

  const lineData = {
    labels: summary.incomeExpense.map((m) => m.month),
    datasets: [
      {
        label: 'Income',
        data: summary.incomeExpense.map((m) => m.income),
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.2)',
      },
      {
        label: 'Expenses',
        data: summary.incomeExpense.map((m) => m.expenses),
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.2)',
      },
    ],
  };

  const pieData = {
    labels: summary.categoryPie.map((c) => c.category),
    datasets: [
      {
        data: summary.categoryPie.map((c) => c.amount),
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#e74a3b',
          '#858796',
        ],
      },
    ],
  };

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Income</h5>
              <p className="card-text fs-4">₹{summary.totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <p className="card-text fs-4">₹{summary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card text-white ${summary.net >= 0 ? 'bg-primary' : 'bg-warning'} mb-3`}>
            <div className="card-body">
              <h5 className="card-title">Net</h5>
              <p className="card-text fs-4">₹{summary.net.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <h5>Income vs Expenses (Last 6 Months)</h5>
          <Line data={lineData} />
        </div>
        <div className="col-md-4 mb-4">
          <h5>Spending Breakdown</h5>
          <Pie data={pieData} />
        </div>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="alert alert-warning">
          <h5>Budget Alerts</h5>
          <ul className="mb-0">
            {budgetAlerts.map((b) => (
              <li key={b._id}>
                {b.category}: {b.percent}% of ₹{b.limit} used.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
