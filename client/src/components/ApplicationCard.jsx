const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

function isStale(app) {
  if (app.status !== 'Applied' && app.status !== 'Interview') return false;
  // SQLite stores UTC as "YYYY-MM-DD HH:MM:SS"
  const updated = new Date(app.updated_at.replace(' ', 'T') + 'Z');
  const days = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
  return days >= 14;
}

export default function ApplicationCard({ app, onEdit, onDelete, onStatusChange }) {
  const stale = isStale(app);

  return (
    <li className={`app-card${stale ? ' stale' : ''}`}>
      <div>
        <div className="app-title">
          <strong>{app.company}</strong> - {app.role}
          {stale && <span className="badge-stale">No update in 14+ days</span>}
        </div>
        <div className="app-meta">
          Applied: {app.date_applied}
          {app.follow_up_date && <> | Follow up: {app.follow_up_date}</>}
        </div>
        {app.job_link && (
          <a href={app.job_link} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
            Job posting
          </a>
        )}
        {app.notes && <p className="app-notes">{app.notes}</p>}
      </div>

      <div className="app-actions">
        <select value={app.status} onChange={(e) => onStatusChange(app, e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="row">
          <button onClick={() => onEdit(app)}>Edit</button>
          <button className="danger" onClick={() => onDelete(app)}>Delete</button>
        </div>
      </div>
    </li>
  );
}