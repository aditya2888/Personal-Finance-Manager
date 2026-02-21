import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import ExpenseChart from '../components/ExpenseChart';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // --- Fetch Data ---
  const fetchTransactions = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/transactions', config);
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
      fetchTransactions(storedUser.token);
    }
  }, [navigate]);

  // --- UI Update Functions ---
  const removeTransactionFromUI = (id) => {
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  const addTransactionToUI = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  // --- Derived State: Advanced Filtering ---
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const txDate = new Date(transaction.createdAt);
      const limitDate = new Date();

      if (timeFilter === 'today') limitDate.setHours(0, 0, 0, 0);
      else if (timeFilter === 'last_week') limitDate.setDate(limitDate.getDate() - 7);
      else if (timeFilter === 'last_month') limitDate.setMonth(limitDate.getMonth() - 1);
      else if (timeFilter === 'last_4_months') limitDate.setMonth(limitDate.getMonth() - 4);
      else if (timeFilter === 'last_6_months') limitDate.setMonth(limitDate.getMonth() - 6);
      else if (timeFilter === 'last_year') limitDate.setFullYear(limitDate.getFullYear() - 1);

      matchesTime = txDate >= limitDate;
    }
    
    return matchesSearch && matchesType && matchesTime;
  });

  // --- Upgraded CSV Export Logic (Day/Month/Year Only) ---
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return alert("No data to export!");

    // 1. Cleaned up headers: Removed Full Date and Time
    const headers = ['Day', 'Month', 'Year', 'Description', 'Category', 'Type', 'Amount (INR)'];
    
    // 2. Map the data to rows
    const rows = filteredTransactions.map(tx => {
      const dateObj = tx.createdAt ? new Date(tx.createdAt) : new Date();
      
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('default', { month: 'long' }); 
      const year = dateObj.getFullYear();

      // Wrapping text in quotes prevents commas in descriptions from breaking the CSV
      const safeText = `"${tx.text}"`;
      const safeCategory = `"${tx.category}"`;

      // 3. Match the returned data exactly to the new headers
      return [
        day,
        month,
        year,
        safeText,
        safeCategory,
        tx.type,
        tx.amount
      ];
    });
    
    // 4. Combine headers and rows into a comma-separated string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // 5. Create a "Blob" and trigger a download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finance_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section className="heading">
        <h1>Welcome, {user?.name}</h1>
        <p>Your Finance Dashboard</p>
      </section>

      {/* Renders the Recharts Donut Chart */}
      <ExpenseChart transactions={filteredTransactions} />

      {/* Renders the input form */}
      <TransactionForm onAdd={addTransactionToUI} />

      <section className="transactions">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ margin: 0 }}>History</h2>
          
          <button onClick={exportToCSV} style={{ background: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Download CSV
          </button>
        </div>
        
        {/* Filter UI */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          <input 
            type="text" 
            placeholder="Search descriptions..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1, minWidth: '150px' }} 
          />
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last_week">Last 7 Days</option>
            <option value="last_month">Last Month</option>
            <option value="last_4_months">Last 4 Months</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="last_year">Last Year</option>
          </select>

        </div>

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction._id} transaction={transaction} onDelete={removeTransactionFromUI} />
            ))}
          </div>
        ) : (
          <h3 style={{textAlign: 'center', color: '#777', marginTop: '20px'}}>
            No transactions found for these filters.
          </h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;