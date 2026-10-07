import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/applications.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', applicationRoutes);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));