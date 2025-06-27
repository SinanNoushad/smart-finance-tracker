import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import dayjs from 'dayjs';
import Button from '../components/ui/Button'; // Assuming you have a Button component

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

  console.log('Dashboard Summary:', summary); // Log the entire summary object

  const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];

  const lineChartData = summary.monthlyTrends.map(item => ({
    month: item.month,
    Income: item.income,
    Expenses: item.expenses,
  }));
  console.log('Line Chart Data:', lineChartData); // Log line chart data

  const pieChartData = summary.topCategories.map(item => ({
    name: item.category,
    value: item.amount,
  }));
  console.log('Pie Chart Data:', pieChartData); // Log pie chart data

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">Dashboard</h3>

      <div className="summary-cards-grid">
        <div className="summary-card income-card">
          <h5 className="card-title">Total Income</h5>
          <p className="card-value">₹{summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expense-card">
          <h5 className="card-title">Total Expenses</h5>
          <p className="card-value">₹{summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`summary-card net-card ${summary.net >= 0 ? 'net-positive' : 'net-negative'}`}>
          <h5 className="card-title">Net Savings</h5>
          <p className="card-value">₹{summary.net.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-card">
          <h5 className="chart-title">Income vs Expenses (Last 6 Months)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#1cc88a" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Expenses" stroke="#e74a3b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h5 className="chart-title">Spending Breakdown</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="alerts-section">
          <h5 className="alerts-title">Budget Alerts</h5>
          <ul className="alerts-list">
            {budgetAlerts.map((b) => (
              <li key={b._id} className="alert-item">
                <span className="alert-category">{b.category}:</span> {b.percent.toFixed(2)}% of ₹{b.limit.toFixed(2)} used.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="action-buttons-section">
        <Link to="/connect-bank">
          <Button variant="primary" size="md">
            Connect Bank Account
          </Button>
        </Link>
        <Button variant="secondary" size="md" onClick={() => api.get('/bank/transactions').then(fetchData)}>
          Fetch New Transactions
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
