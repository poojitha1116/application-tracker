import { useEffect, useState } from 'react';
import {
  getApplications,
  getSummary,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
} from './api';
import ApplicationForm from './components/ApplicationForm';
import ApplicationCard from './components/ApplicationCard';
import Toolbar from './components/Toolbar';
import SummaryBar from './components/SummaryBar';
import './App.css';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the application being edited, or null for "add"
  const [filters, setFilters] = useState({ search: '', status: '', sort: 'date_desc' });

  async function load() {
  try {
    setError('');
    const [apps, sum] = await Promise.all([getApplications(filters), getSummary()]);
    setApplications(apps);
    setSummary(sum);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [filters]);


  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(app) {
    setEditing(app);
    setFormOpen(true);
  }

  async function handleSave(data) {
    if (editing) await updateApplication(editing.id, data);
    else await createApplication(data);
    setFormOpen(false);
    await load();
  }

  async function handleDelete(app) {
    if (!window.confirm(`Delete ${app.company} - ${app.role}?`)) return;
    try {
      await deleteApplication(app.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }
  
  async function handleStatusChange(app, status) {
  try {
    await updateStatus(app.id, status);
    await load();
  } catch (err) {
    setError(err.message);
  }
}

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, textAlign: 'left' }}>
      <h1>Application Tracker</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <SummaryBar summary={summary} />

      <Toolbar filters={filters} onChange={setFilters} onAdd={openAdd} />
      {applications.length === 0 ? (
        <p>No applications yet. Add your first one!</p>
      ) : (
        <ul style={{ padding: 0, marginTop: 16 }}>
  {applications.map((a) => (
    <ApplicationCard
      key={a.id}
      app={a}
      onEdit={openEdit}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
    />
  ))}
</ul>
      )}

      {formOpen && (
        <ApplicationForm
          initialData={editing}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}