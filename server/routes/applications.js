import { Router } from 'express';
import db from '../db.js';
import { STATUSES, validateApplication } from '../validate.js';

const router = Router();

// Whitelist: user input never goes directly into ORDER BY
const SORTS = {
  date_desc: 'date_applied DESC, id DESC',
  date_asc: 'date_applied ASC, id ASC',
  company: 'company COLLATE NOCASE ASC',
  updated_desc: 'updated_at DESC',
};

const parseId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid id' });
    return null;
  }
  return id;
};

// LIST
router.get('/applications', (req, res) => {
  const { search = '', status = '', sort = 'date_desc' } = req.query;
  const where = [];
  const params = [];

  if (search.trim()) {
    where.push('(company LIKE ? OR role LIKE ?)');
    params.push(`%${search.trim()}%`, `%${search.trim()}%`);
  }
  if (status) {
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status filter' });
    where.push('status = ?');
    params.push(status);
  }

  const orderBy = SORTS[sort] || SORTS.date_desc;
  const sql = `SELECT * FROM applications
               ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
               ORDER BY ${orderBy}`;
  res.json(db.prepare(sql).all(...params));
});

// CREATE
router.post('/applications', (req, res) => {
  const { errors, value } = validateApplication(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = db.prepare(`
    INSERT INTO applications (company, role, date_applied, status, job_link, notes, follow_up_date)
    VALUES (@company, @role, @date_applied, @status, @job_link, @notes, @follow_up_date)
  `).run(value);

  const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// FULL UPDATE
router.put('/applications/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const { errors, value } = validateApplication(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const result = db.prepare(`
    UPDATE applications
    SET company=@company, role=@role, date_applied=@date_applied, status=@status,
        job_link=@job_link, notes=@notes, follow_up_date=@follow_up_date,
        updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...value, id });

  if (result.changes === 0) return res.status(404).json({ error: 'Application not found' });
  res.json(db.prepare('SELECT * FROM applications WHERE id = ?').get(id));
});

// QUICK STATUS CHANGE
router.patch('/applications/:id/status', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ errors: [`status must be one of: ${STATUSES.join(', ')}`] });
  }

  const result = db.prepare(
    `UPDATE applications SET status = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(status, id);

  if (result.changes === 0) return res.status(404).json({ error: 'Application not found' });
  res.json(db.prepare('SELECT * FROM applications WHERE id = ?').get(id));
});

// DELETE
router.delete('/applications/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const result = db.prepare('DELETE FROM applications WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Application not found' });
  res.status(204).end();
});

// SUMMARY
router.get('/summary', (req, res) => {
  const rows = db.prepare('SELECT status, COUNT(*) AS count FROM applications GROUP BY status').all();
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  rows.forEach((r) => (byStatus[r.status] = r.count));

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const responded = byStatus.Interview + byStatus.Offer + byStatus.Rejected;
  const responseRate = total ? Math.round((responded / total) * 100) : 0;

  res.json({ total, byStatus, responseRate });
});

export default router;