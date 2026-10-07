const COLORS = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

export default function SummaryBar({ summary }) {
  if (!summary) return null;

  const cardStyle = {
    flex: 1,
    minWidth: 100,
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '10px 12px',
    textAlign: 'center',
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '12px 0' }}>
      <div style={cardStyle}>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>{summary.total}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Total</div>
      </div>

      {Object.entries(summary.byStatus).map(([status, count]) => (
        <div key={status} style={{ ...cardStyle, borderTop: `4px solid ${COLORS[status]}` }}>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{count}</div>
          <div style={{ fontSize: 13, color: '#666' }}>{status}</div>
        </div>
      ))}

      <div style={cardStyle}>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>{summary.responseRate}%</div>
        <div style={{ fontSize: 13, color: '#666' }}>Response rate</div>
      </div>
    </div>
  );
}