const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationCard({ app, onEdit, onDelete, onStatusChange }) {
  return (
    <li
      style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        listStyle: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <strong>{app.company}</strong> - {app.role}
          <div style={{ fontSize: 13, color: '#666' }}>
            Applied: {app.date_applied}
            {app.follow_up_date && <> | Follow up: {app.follow_up_date}</>}
          </div>
          {app.job_link && (
            <a href={app.job_link} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
              Job posting
            </a>
          )}
          {app.notes && <p style={{ margin: '6px 0 0', fontSize: 14 }}>{app.notes}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <select value={app.status} onChange={(e) => onStatusChange(app, e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onEdit(app)}>Edit</button>
            <button onClick={() => onDelete(app)}>Delete</button>
          </div>
        </div>
      </div>
    </li>
  );
}