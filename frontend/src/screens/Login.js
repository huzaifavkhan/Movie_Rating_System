import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      if (response.data.success) {
        const userData = response.data.user;
        setSuccessMessage('Login successful!');
        login({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          isAdmin: userData.is_admin || false,
        });

        setTimeout(() => {
          navigate(userData.isAdmin ? '/admin/dashboard' : '/films');
        }, 100);
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.signupText}>
          Don&apos;t have an account?{' '}
          <span onClick={goToSignup} style={styles.signupLink}>
            Create one
          </span>
        </p>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    margin: 0,
    padding: 0,
    backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/9c5457b8-9ab0-4a04-9fc1-e608d5670f1a/aad8cd4d-f4ac-49af-8539-25a81bf459d0/US-en-20210719-popsignuptwoweeks-perspective_alpha_website_large.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '600px',
    padding: '40px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    color: 'white',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    fontSize: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  checkboxLabel: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  },
  label: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '18px',
    marginRight: '20px',
    width: '100px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    width: '350px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    width: '200px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    alignSelf: 'center',
  },
  signupText: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  signupLink: {
    color: 'lightblue',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Login;
