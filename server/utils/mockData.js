const dayjs = require('dayjs');

// Generate mock transactions for the given month with comprehensive data
const categories = [
  // Income categories
  { name: 'Salary', type: 'income', subcategories: ['Monthly Salary', 'Bonus', 'Commission'] },
  { name: 'Freelance', type: 'income', subcategories: ['Project Work', 'Consulting', 'Tutoring'] },
  { name: 'Investments', type: 'income', subcategories: ['Dividends', 'Interest', 'Capital Gains'] },
  
  // Expense categories with realistic subcategories and weights
  {
    name: 'Housing',
    type: 'expense',
    weight: 30, // 30% of expenses
    subcategories: [
      { name: 'Rent', amount: { min: 15000, max: 30000 } },
      { name: 'Utilities', amount: { min: 2000, max: 8000 } },
      { name: 'Maintenance', amount: { min: 1000, max: 5000 } },
      { name: 'Property Tax', amount: { min: 5000, max: 15000 }, frequency: 0.1 } // 10% chance
    ]
  },
  {
    name: 'Food',
    type: 'expense',
    weight: 20, // 20% of expenses
    subcategories: [
      { name: 'Groceries', amount: { min: 3000, max: 10000 } },
      { name: 'Dining Out', amount: { min: 500, max: 5000 } },
      { name: 'Coffee Shops', amount: { min: 100, max: 2000 } },
      { name: 'Snacks', amount: { min: 50, max: 1000 } }
    ]
  },
  {
    name: 'Transportation',
    type: 'expense',
    weight: 15, // 15% of expenses
    subcategories: [
      { name: 'Fuel', amount: { min: 2000, max: 10000 } },
      { name: 'Public Transport', amount: { min: 500, max: 3000 } },
      { name: 'Parking', amount: { min: 100, max: 2000 } },
      { name: 'Car Maintenance', amount: { min: 1000, max: 15000 }, frequency: 0.3 } // 30% chance
    ]
  },
  {
    name: 'Entertainment',
    type: 'expense',
    weight: 10, // 10% of expenses
    subcategories: [
      { name: 'Movies', amount: { min: 200, max: 2000 } },
      { name: 'Streaming', amount: { min: 100, max: 1500 } },
      { name: 'Concerts', amount: { min: 1000, max: 10000 }, frequency: 0.2 },
      { name: 'Hobbies', amount: { min: 500, max: 5000 } }
    ]
  },
  {
    name: 'Shopping',
    type: 'expense',
    weight: 15, // 15% of expenses
    subcategories: [
      { name: 'Clothing', amount: { min: 1000, max: 15000 } },
      { name: 'Electronics', amount: { min: 5000, max: 100000 }, frequency: 0.1 },
      { name: 'Home Goods', amount: { min: 500, max: 10000 } },
      { name: 'Gifts', amount: { min: 500, max: 10000 } }
    ]
  },
  {
    name: 'Health',
    type: 'expense',
    weight: 5, // 5% of expenses
    subcategories: [
      { name: 'Doctor', amount: { min: 500, max: 5000 } },
      { name: 'Pharmacy', amount: { min: 200, max: 3000 } },
      { name: 'Insurance', amount: { min: 2000, max: 10000 }, frequency: 0.5 },
      { name: 'Gym', amount: { min: 1000, max: 3000 } }
    ]
  },
  {
    name: 'Personal',
    type: 'expense',
    weight: 5, // 5% of expenses
    subcategories: [
      { name: 'Haircut', amount: { min: 200, max: 2000 }, frequency: 0.3 },
      { name: 'Spa', amount: { min: 1000, max: 5000 }, frequency: 0.2 },
      { name: 'Self-care', amount: { min: 500, max: 5000 } },
      { name: 'Education', amount: { min: 1000, max: 20000 } }
    ]
  }
];

const generateTransactionsForMonth = (currentMonth, isCurrentMonth) => {
  const monthTransactions = [];
  const monthDays = currentMonth.daysInMonth();

  // Add primary income (salary)
  if (isCurrentMonth || Math.random() > 0.7) { // 70% chance for past months
    monthTransactions.push({
      date: currentMonth.date(1).toDate(),
      description: 'Monthly Salary',
      category: 'Salary',
      amount: 85000 + Math.floor(Math.random() * 30000), // 85k-115k
      type: 'income',
      isRecurring: true
    });
    
    // Add secondary income (freelance)
    if (Math.random() > 0.4) {
      monthTransactions.push({
        date: currentMonth.date(15).toDate(),
        description: 'Freelance Project',
        category: 'Freelance',
        amount: Math.floor(Math.random() * 30000) + 10000, // 10k-40k
        type: 'income',
        isRecurring: true
      });
    }
  }
  
  // Get expense categories with their weights
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const totalWeight = expenseCategories.reduce((sum, cat) => sum + cat.weight, 0);
  
  // Generate 20-40 transactions per month
  const numTransactions = Math.floor(Math.random() * 21) + 20;
  
  for (let i = 0; i < numTransactions; i++) {
    // Select category based on weight
    let rand = Math.random() * totalWeight;
    let selectedCategory;
    for (const cat of expenseCategories) {
      rand -= cat.weight;
      if (rand <= 0) {
        selectedCategory = cat;
        break;
      }
    }
    
    // Select subcategory
    const validSubcats = selectedCategory.subcategories.filter(
      sub => !sub.frequency || Math.random() <= sub.frequency
    );
    
    if (validSubcats.length === 0) continue;
    
    const subcat = validSubcats[Math.floor(Math.random() * validSubcats.length)];
    const amount = typeof subcat.amount === 'object'
      ? -Math.floor(Math.random() * (subcat.amount.max - subcat.amount.min + 1)) - subcat.amount.min
      : -Math.floor(Math.random() * 5000) - 100; // Default fallback
    
    monthTransactions.push({
      date: currentMonth.date(Math.floor(Math.random() * monthDays) + 1).toDate(),
      description: `${subcat.name} ${i % 5 === 0 ? '' : Math.floor(i / 5) + 1}`.trim(),
      category: selectedCategory.name,
      subcategory: subcat.name,
      amount: amount,
      type: 'expense',
      isRecurring: Math.random() > 0.8 // 20% chance of being recurring
    });
  }
  return monthTransactions;
};

const generateMockTransactions = (userId, numMonths = 0, numNewTransactions = 0) => {
  const transactions = [];
  const now = dayjs();

  if (numNewTransactions > 0) {
    // Generate a few new transactions for the current month
    const currentMonth = now;
    const monthDays = currentMonth.daysInMonth();
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const totalWeight = expenseCategories.reduce((sum, cat) => sum + cat.weight, 0);

    for (let i = 0; i < numNewTransactions; i++) {
      let rand = Math.random() * totalWeight;
      let selectedCategory;
      for (const cat of expenseCategories) {
        rand -= cat.weight;
        if (rand <= 0) {
          selectedCategory = cat;
          break;
        }
      }
      const validSubcats = selectedCategory.subcategories.filter(
        sub => !sub.frequency || Math.random() <= sub.frequency
      );
      if (validSubcats.length === 0) continue;
      const subcat = validSubcats[Math.floor(Math.random() * validSubcats.length)];
      const amount = typeof subcat.amount === 'object'
        ? -Math.floor(Math.random() * (subcat.amount.max - subcat.amount.min + 1)) - subcat.amount.min
        : -Math.floor(Math.random() * 5000) - 100;

      transactions.push({
        date: currentMonth.date(Math.floor(Math.random() * monthDays) + 1).toDate(),
        description: `${subcat.name} (New)`.trim(),
        category: selectedCategory.name,
        subcategory: subcat.name,
        amount: amount,
        type: 'expense',
        isRecurring: Math.random() > 0.8
      });
    }
  } else if (numMonths > 0) {
    // Generate data for the last `numMonths`
    for (let m = 0; m < numMonths; m++) {
      const currentMonth = now.subtract(m, 'month');
      const isCurrentMonth = m === 0;
      transactions.push(...generateTransactionsForMonth(currentMonth, isCurrentMonth));
    }
  }

  // Sort by date
  return transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Generate mock summary with more detailed breakdown
generateMockSummary = (transactions) => {
  // Filter transactions for the selected month
  const currentMonth = dayjs().format('YYYY-MM');
  const monthlyTransactions = transactions.filter(t => 
    dayjs(t.date).format('YYYY-MM') === currentMonth
  );
  
  // Calculate totals
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = Math.abs(monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));
    
  // Calculate by category
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});
    
  // Calculate by month for the last 6 months
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month').format('YYYY-MM');
    const monthTransactions = transactions.filter(t => 
      dayjs(t.date).format('YYYY-MM') === month
    );
    
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthExpenses = Math.abs(monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
      
    monthlyTrends.push({
      month: dayjs(month).format('MMM YY'),
      income: monthIncome,
      expenses: monthExpenses,
      net: monthIncome - monthExpenses
    });
  }
  
  // Get top 5 expense categories
  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));
    
  return {
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
    monthlyTrends,
    topCategories,
    // Add more detailed breakdowns as needed
  };
};

module.exports = {
  generateMockTransactions,
  generateMockSummary
};
