require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendErrorEmail } = require('./error-reporter');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.BUG_REPORT_ORIGIN || '*' }));

app.post('/send-error', async (req, res) => {
  const payload = req.body;
  if (!payload || (!payload.message && !payload.stack && !payload.errorMessage)) {
    return res.status(400).json({ success: false, error: 'Invalid payload: message/stack required' });
  }

  // Fire-and-forget: the reporter already gates sending behind ENABLE_ERROR_REPORTING.
  sendErrorEmail(payload)
    .then(() => {})
    .catch((e) => console.error('send-error route failed:', e));

  return res.json({ success: true });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Error server running on port ${PORT}`);
});