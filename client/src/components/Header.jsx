import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // Check if a user is currently logged in
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    // 1. Destroy the VIP wristband in the browser memory
    localStorage.removeItem('user');
    // 2. Redirect them to the login page
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Finance Manager</Link>
      </div>
      <ul>
        {/* CONDITIONAL RENDERING: If user exists, show Logout. If not, show Login/Register */}
        {user ? (
          <li>
            <button className="btn" onClick={onLogout} style={{ background: '#dc3545' }}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;