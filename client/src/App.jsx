import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Dashboard from './pages/Dashboard'; // <-- IMPORT NEW PAGE
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Router>
        <div className="container" style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} /> {/* <-- ADD NEW ROUTE */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;