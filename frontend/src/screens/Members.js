import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Members() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/members');
      setMembers(response.data);
    } catch (error) {
      setError('Failed to fetch members. Please try again later.');
      console.error('Error fetching members:', error);
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/members/${id}`);
      // Update the members list after deletion
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Failed to delete member. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.header}>Registered Users</h2>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : members.length === 0 ? (
        <p style={styles.info}>No users found.</p>
      ) : (
        <table style={styles.table} border="1" cellPadding="10">
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID</th>
              <th style={styles.tableHeader}>Username</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={styles.tableCell}>{member.id}</td>
                <td style={styles.tableCell}>{member.username}</td>
                <td style={styles.tableCell}>{member.email}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => deleteMember(member.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#000', // Black background for the entire page
    minHeight: '100vh', // Ensure the black background covers the entire viewport
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#fff', // Default text color set to white for better contrast
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#fff', // Header text color set to white
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    backgroundColor: '#000', // Match the table background with the page
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: '1px solid white', // White border for table headers
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    color: '#fff', // White text for better contrast
    border: '1px solid white', // White outline for individual cells
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)', // Subtle shadow for depth
  },
  deleteButton: {
    padding: '8px 12px',
    color: 'white',
    backgroundColor: 'red',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontSize: '16px',
  },
  info: {
    color: '#bbb', // Adjusted text color for "no users found" message
    fontSize: '16px',
  },
};


export default Members;
