import { useEffect, useState } from 'react';
import {
  getApplications,
  getSummary,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
  exportCsv 
} from './api';
import ApplicationForm from './components/ApplicationForm';
import ApplicationCard from './components/ApplicationCard';
import SummaryBar from './components/SummaryBar';
import Toolbar from './components/Toolbar';
import './App.css';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // application being edited, or null for "add"
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

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>Application Tracker</h1>
      {error && <p className="error">Error: {error}</p>}

      <SummaryBar summary={summary} />
      <Toolbar
        filters={filters}
        onChange={setFilters}
        onAdd={openAdd}
        onExport={() => exportCsv(applications)}
      />
      {applications.length === 0 ? (
        <p className="empty">No applications found. Add one, or clear your filters.</p>
      ) : (
        <ul className="app-list">
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