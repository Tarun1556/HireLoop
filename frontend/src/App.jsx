import { useState, useEffect } from 'react';
import apiClient from './services/apiClient';

function App() {
  const [health, setHealth] = useState({ status: 'LOADING...', service: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get('/health')
      .then((response) => {
        setHealth(response.data);
      })
      .catch((err) => {
        console.error('Failed to connect to backend:', err);
        setError('OFFLINE');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>HireLoop Frontend</h1>
      <p>
        <strong>Backend Status:</strong>{' '}
        <span style={{ color: error ? 'red' : 'green' }}>
          {error ? error : `${health.status} (${health.service})`}
        </span>
      </p>
    </div>
  );
}

export default App;