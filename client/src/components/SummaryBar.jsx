const COLORS = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

export default function SummaryBar({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary">
      <div className="summary-card">
        <div className="num">{summary.total}</div>
        <div className="label">Total</div>
      </div>

      {Object.entries(summary.byStatus).map(([status, count]) => (
        <div key={status} className="summary-card" style={{ borderTop: `4px solid ${COLORS[status]}` }}>
          <div className="num">{count}</div>
          <div className="label">{status}</div>
        </div>
      ))}

      <div className="summary-card">
        <div className="num">{summary.responseRate}%</div>
        <div className="label">Response rate</div>
      </div>
    </div>
  );
}