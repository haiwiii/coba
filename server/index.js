/* global process */
import express from 'express';
import cors from 'cors';
import { initialCustomers } from '../src/data/initialData.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'LeadSight API running' });
});

// Return initial customers as a simple read-only API for frontend development
app.get('/api/customers', (req, res) => {
  try {
    return res.json({ customers: initialCustomers });
  } catch {
    return res.status(500).json({ error: 'Failed to load customers' });
  }
});

app.listen(PORT, () => {
  console.log(`LeadSight API listening on http://localhost:${PORT}`);
});
