import axios from 'axios';
import { toast } from 'react-toastify';

function TransactionItem({ transaction, onDelete }) {
  const deleteTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // 1. Tell the backend to delete it
      await axios.delete(`http://localhost:5000/api/transactions/${transaction._id}`, config);
      
      // 2. Tell the Dashboard UI to remove it from the screen
      onDelete(transaction._id);
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error('Error deleting transaction');
    }
  };

  return (
    <div className="transaction">
      <div>
        {/* We format the MongoDB date into a clean Indian date format */}
        <div className="tx-date">{new Date(transaction.createdAt).toLocaleDateString('en-IN')}</div>
        <h3>{transaction.text}</h3>
        <p className="tx-category">{transaction.category}</p>
      </div>
      
      {/* If it's income, make it green and add a +. If expense, red and - */}
      <div className={`tx-amount ${transaction.type === 'income' ? 'plus' : 'minus'}`}>
        {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
      </div>
      
      <button onClick={deleteTransaction} className="close">X</button>
    </div>
  );
}

export default TransactionItem;