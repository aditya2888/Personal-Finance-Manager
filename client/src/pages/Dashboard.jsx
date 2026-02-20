import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from the backend
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
      fetchTransactions(storedUser.token); // Call the fetch function!
    }
  }, [navigate]);

  // Pass this function down so the UI updates when we click 'X'
  const removeTransactionFromUI = (id) => {
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  return (
    <>
      <section className="heading">
        <h1>Welcome, {user?.name}</h1>
        <p>Your Finance Dashboard</p>
      </section>

      <TransactionForm />

      <section className="transactions">
        <h2>History</h2>
        {transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction._id} 
                transaction={transaction} 
                onDelete={removeTransactionFromUI} 
              />
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