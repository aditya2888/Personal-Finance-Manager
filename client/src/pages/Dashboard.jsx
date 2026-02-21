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

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all'); // <-- NEW: Time Filter State

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

  const removeTransactionFromUI = (id) => {
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  const addTransactionToUI = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  // THE SENIOR LOGIC: Filter by Search, Type, AND Time
  const filteredTransactions = transactions.filter((transaction) => {
    // 1. Text Search Match
    const matchesSearch = transaction.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Type Match
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    // 3. Time Match Logic
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const txDate = new Date(transaction.createdAt);
      const limitDate = new Date(); // Gets current exact date and time

      // Subtract the correct amount of time based on the dropdown selection
      if (timeFilter === 'today') {
        limitDate.setHours(0, 0, 0, 0); // Start of today
      } else if (timeFilter === 'last_week') {
        limitDate.setDate(limitDate.getDate() - 7);
      } else if (timeFilter === 'last_month') {
        limitDate.setMonth(limitDate.getMonth() - 1);
      } else if (timeFilter === 'last_4_months') {
        limitDate.setMonth(limitDate.getMonth() - 4);
      } else if (timeFilter === 'last_6_months') {
        limitDate.setMonth(limitDate.getMonth() - 6);
      } else if (timeFilter === 'last_year') {
        limitDate.setFullYear(limitDate.getFullYear() - 1);
      }

      // Keep it if the transaction date is newer than or equal to our limit limit
      matchesTime = txDate >= limitDate;
    }

    // Must pass all three checks to be displayed!
    return matchesSearch && matchesType && matchesTime;
  });

  return (
    <>
      <section className="heading">
        <h1>Welcome, {user?.name}</h1>
        <p>Your Finance Dashboard</p>
      </section>

      <ExpenseChart transactions={filteredTransactions} />

      <TransactionForm onAdd={addTransactionToUI} />

      <section className="transactions">
        <h2>History</h2>
        
        {/* THE UI FOR ALL FILTERS */}
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

          {/* NEW: The Time Filter Dropdown */}
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