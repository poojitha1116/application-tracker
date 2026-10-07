import { useState } from 'react';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];
const today = () => new Date().toISOString().slice(0, 10);

export default function ApplicationForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState({
    company: initialData?.company ?? '',
    role: initialData?.role ?? '',
    date_applied: initialData?.date_applied ?? today(),
    status: initialData?.status ?? 'Applied',
    job_link: initialData?.job_link ?? '',
    follow_up_date: initialData?.follow_up_date ?? '',
    notes: initialData?.notes ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'white', color: 'black', padding: 20, borderRadius: 8, width: 420, display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <h2>{initialData ? 'Edit application' : 'Add application'}</h2>

        <label>Company *
          <input name="company" value={form.company} onChange={change} style={{ width: '100%' }} />
        </label>
        <label>Role *
          <input name="role" value={form.role} onChange={change} style={{ width: '100%' }} />
        </label>
        <label>Date applied
          <input type="date" name="date_applied" value={form.date_applied} onChange={change} />
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={change}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Job link
          <input name="job_link" value={form.job_link} onChange={change} style={{ width: '100%' }} />
        </label>
        <label>Follow-up date
          <input type="date" name="follow_up_date" value={form.follow_up_date} onChange={change} />
        </label>
        <label>Notes
          <textarea name="notes" value={form.notes} onChange={change} rows={3} style={{ width: '100%' }} />
        </label>

        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}