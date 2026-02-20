import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Check browser memory for the user data
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // 2. If no user is found, kick them to the login page
    if (!storedUser) {
      navigate('/login');
    } else {
      // 3. Otherwise, set the user state so we can display their name
      setUser(storedUser);
    }
  }, [navigate]);

  return (
    <>
      <section className="heading">
        {/* We use user?.name so it doesn't crash if user is temporarily null */}
        <h1>Welcome, {user?.name}</h1>
        <p>Your Finance Dashboard</p>
      </section>
      
      {/* In the next step, we will put the form to add an expense right here! */}
    </>
  );
}

export default Dashboard;