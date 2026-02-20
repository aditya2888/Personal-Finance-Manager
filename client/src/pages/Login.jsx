import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Logged in successfully!');
        navigate('/'); // Redirect to dashboard
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <section className="heading">
        <h2>Welcome Back</h2>
        <p>Login to manage your finances</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="email" name="email" id="email" value={email} placeholder="Enter your email" onChange={onChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" id="password" value={password} placeholder="Enter your password" onChange={onChange} required />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;