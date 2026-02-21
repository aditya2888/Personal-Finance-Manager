import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import ExpenseChart from '../components/ExpenseChart'; // <-- 1. IMPORT CHART

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

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

  // 2. We also need to add new transactions to the UI instantly so the chart updates live!
  const addTransactionToUI = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  return (
    <>
      <section className="heading">
        <h1>Welcome, {user?.name}</h1>
        <p>Your Finance Dashboard</p>
      </section>

      {/* 3. RENDER THE CHART (Passing the transactions as a prop) */}
      <ExpenseChart transactions={transactions} />

      {/* 4. Pass the add function to the form */}
      <TransactionForm onAdd={addTransactionToUI} />

      <section className="transactions">
        <h2>History</h2>
        {transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction._id} transaction={transaction} onDelete={removeTransactionFromUI} />
            ))}
          </div>
        ) : (
          <h3 style={{textAlign: 'center', color: '#777', marginTop: '20px'}}>
            You have no transactions yet
          </h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;