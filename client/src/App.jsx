import { useEffect, useState } from 'react';
import { getApplications, getSummary } from './api';
import './App.css';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setError('');
      const [apps, sum] = await Promise.all([getApplications(), getSummary()]);
      setApplications(apps);
      setSummary(sum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, textAlign: 'left' }}>
      <h1>Application Tracker</h1>
      <p>
        Total: {summary.total} | Response rate: {summary.responseRate}%
      </p>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((a) => (
            <li key={a.id}>
              <strong>{a.company}</strong> - {a.role} ({a.status}) - {a.date_applied}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}