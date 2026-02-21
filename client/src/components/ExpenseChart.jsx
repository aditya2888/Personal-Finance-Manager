import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ExpenseChart({ transactions }) {
  // 1. Filter out incomes, we only want to chart expenses
  const expenses = transactions.filter(t => t.type === 'expense');

  // 2. Group the expenses by category using reduce
  // This turns [{category: 'Food', amount: 10}, {category: 'Food', amount: 20}] 
  // into [{name: 'Food', value: 30}]
  const groupedData = expenses.reduce((acc, current) => {
    const existingCategory = acc.find(item => item.name === current.category);
    if (existingCategory) {
      existingCategory.value += current.amount;
    } else {
      acc.push({ name: current.category, value: current.amount });
    }
    return acc;
  }, []);

  // 3. Define professional colors for the chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#e83e8c'];

  // 4. If there are no expenses, show a placeholder
  if (groupedData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>No expenses to chart yet.</div>;
  }

  return (
    <div className="chart-container" style={{ width: '100%', height: 300, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={groupedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {groupedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;