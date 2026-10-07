export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));

// Returns { errors: [...], value: {...cleaned fields} }
export function validateApplication(body = {}) {
  const errors = [];
  const company = String(body.company ?? '').trim();
  const role = String(body.role ?? '').trim();
  const date_applied = String(body.date_applied ?? '').trim();
  const status = body.status ?? 'Applied';
  const job_link = String(body.job_link ?? '').trim() || null;
  const notes = String(body.notes ?? '').trim() || null;
  const follow_up_date = String(body.follow_up_date ?? '').trim() || null;

  if (!company) errors.push('company is required');
  if (!role) errors.push('role is required');
  if (!isDate(date_applied)) errors.push('date_applied must be a valid YYYY-MM-DD date');
  if (!STATUSES.includes(status)) errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  if (follow_up_date && !isDate(follow_up_date)) errors.push('follow_up_date must be YYYY-MM-DD');

  return {
    errors,
    value: { company, role, date_applied, status, job_link, notes, follow_up_date },
  };
}