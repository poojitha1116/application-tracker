const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null; // DELETE returns no body

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.errors?.join(', ') || data?.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const getApplications = ({ search = '', status = '', sort = 'date_desc' } = {}) => {
  const params = new URLSearchParams({ search, status, sort });
  return request(`/applications?${params}`);
};

export const getSummary = () => request('/summary');

export const createApplication = (data) =>
  request('/applications', { method: 'POST', body: JSON.stringify(data) });

export const updateApplication = (id, data) =>
  request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const updateStatus = (id, status) =>
  request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const deleteApplication = (id) =>
  request(`/applications/${id}`, { method: 'DELETE' });
export const exportCsv = (applications) => {
  const cols = ['company', 'role', 'date_applied', 'status', 'job_link', 'follow_up_date', 'notes'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [cols.join(','), ...applications.map((a) => cols.map((c) => esc(a[c])).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'applications.csv';
  link.click();
  URL.revokeObjectURL(url);
};