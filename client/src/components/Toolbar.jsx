const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function Toolbar({ filters, onChange, onAdd }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
      <input
        placeholder="Search company or role..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{ flex: 1, minWidth: 180 }}
      />
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
      >
        <option value="date_desc">Newest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="company">Company A-Z</option>
        <option value="updated_desc">Recently updated</option>
      </select>
      <button onClick={onAdd}>+ Add application</button>
    </div>
  );
}