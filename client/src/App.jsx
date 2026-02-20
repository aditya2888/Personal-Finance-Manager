import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <h1>Finance Manager</h1>
          <Routes>
            {/* We will add our pages here in the next step! */}
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;