import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function TransactionForm() {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // Defaults to expense
  const [category, setCategory] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Get the user's VIP token from the browser memory
      const user = JSON.parse(localStorage.getItem('user'));
      
      // 2. Set up the exact Headers our backend bouncer expects
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // 3. Package the data
      const newTransaction = { 
        text, 
        amount: Number(amount), 
        type, 
        category 
      };

      // 4. Send it to the backend! (Notice we pass the 'config' as the 3rd argument)
      await axios.post('http://localhost:5000/api/transactions', newTransaction, config);

      toast.success('Transaction added!');
      
      // Clear the form fields after success
      setText('');
      setAmount('');
      setType('expense');
      setCategory('');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding transaction');
    }
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Description (e.g., Groceries)</label>
          <input type="text" id="text" value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category (e.g., Food, Salary)</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="form-group">
          <button className="btn btn-block" type="submit" style={{ background: '#007bff' }}>
            Add Transaction
          </button>
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;