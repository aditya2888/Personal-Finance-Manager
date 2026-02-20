import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Register() {
  // 1. Setup state for our form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  // 2. Handle typing in the inputs
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 3. Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    try {
      // Send the data to our Node backend!
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      if (response.data) {
        // Save the VIP wristband (token) to the browser's memory
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Registration successful!');
        navigate('/'); // Redirect them to the main dashboard
      }
    } catch (error) {
      // If the backend sends an error (like "User already exists"), pop up a toast notification
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <section className="heading">
        <h2>Create an Account</h2>
        <p>Start tracking your finances today</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" name="name" id="name" value={name} placeholder="Enter your name" onChange={onChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" id="email" value={email} placeholder="Enter your email" onChange={onChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" id="password" value={password} placeholder="Create a password" onChange={onChange} required />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;