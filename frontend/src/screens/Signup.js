// === Signup.js ===

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.isAdmin
        ? 'http://localhost:5000/admin/signup'
        : 'http://localhost:5000/signup';

      const response = await axios.post(endpoint, formData);

      setSuccessMessage(response.data.message || 'Signup successful!');
      setErrorMessage('');

      login({
        id: response.data.userId,
        username: formData.username,
        email: formData.email,
        isAdmin: formData.isAdmin,
      });

      setTimeout(() => {
        navigate(formData.isAdmin ? '/admin/dashboard' : '/films');
      }, 100);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Signup failed.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>Sign Up</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
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

          <div style={styles.checkboxField}>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <label style={styles.checkboxLabel}>Sign up as Admin</label>
          </div>

          <button type="submit" style={styles.button}>
            Sign Up Now
          </button>
        </form>
        {successMessage && (
          <p style={styles.successMessage}>{successMessage}</p>
        )}
        {errorMessage && (
          <p style={styles.errorMessage}>{errorMessage}</p>
        )}
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
    marginBottom: '50px',
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
    marginTop: '30px',
    alignSelf: 'center',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '25px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Signup;
