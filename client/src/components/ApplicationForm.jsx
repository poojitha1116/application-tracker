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
    <div className="overlay" onClick={onClose}>
      <form className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? 'Edit application' : 'Add application'}</h2>

        <label>Company *
          <input name="company" value={form.company} onChange={change} />
        </label>
        <label>Role *
          <input name="role" value={form.role} onChange={change} />
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
          <input name="job_link" value={form.job_link} onChange={change} placeholder="https://..." />
        </label>
        <label>Follow-up date
          <input type="date" name="follow_up_date" value={form.follow_up_date} onChange={change} />
        </label>
        <label>Notes
          <textarea name="notes" value={form.notes} onChange={change} rows={3} />
        </label>

        {error && <p className="error" style={{ margin: 0 }}>{error}</p>}

        <div className="buttons">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}