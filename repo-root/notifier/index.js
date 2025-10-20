const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/notify/email', (req, res) => {
  const { to, subject, body } = req.body;
  console.log(`[Notifier] Email -> to:${to} subject:${subject}`);
  // simulate delay
  setTimeout(() => {
    res.json({ success: true, message: 'email queued' });
  }, 300);
});

app.post('/notify/sms', (req, res) => {
  const { to, message } = req.body;
  console.log(`[Notifier] SMS -> to:${to} message:${message}`);
  setTimeout(() => {
    res.json({ success: true, message: 'sms queued' });
  }, 200);
});

app.get('/health', (req, res) => res.json({ status: 'UP' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Notifier running on ${port}`));
