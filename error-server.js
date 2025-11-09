// error-server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Nodemailer transporter using private credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EXPO_EMAIL_USER,
    pass: process.env.EXPO_EMAIL_PASS,
  },
});

// Function to send error email
async function sendErrorEmail(errorDetails) {
  const errorMessage = errorDetails.stack || errorDetails.errorMessage || String(errorDetails);

  const mailOptions = {
    from: process.env.EXPO_EMAIL_USER,
    to: process.env.EXPO_EMAIL_TO,
    subject: `[ERROR ALERT] ${new Date().toISOString()}`,
    text: `
An error occurred in the app:

User: ${errorDetails.userName || 'Anonymous'}
User ID: ${errorDetails.userId || 'unknown'}
Platform: ${errorDetails.platform || 'unknown'}
App Version: ${errorDetails.appVersion || 'unknown'}

Error Details:
${errorMessage}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Error email sent:', info.messageId || info);
  } catch (err) {
    console.error('Failed to send error email:', err);
  }
}

// POST endpoint to receive errors from the app
app.post('/send-error', async (req, res) => {
  const errorDetails = req.body;
  try {
    await sendErrorEmail(errorDetails); // ← Email sent here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional: global handlers for uncaught exceptions & unhandled rejections
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await sendErrorEmail({ errorMessage: err.stack || String(err) });
  setTimeout(() => process.exit(1), 2000);
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled Rejection:', reason);
  await sendErrorEmail({ errorMessage: reason.stack || String(reason) });
  setTimeout(() => process.exit(1), 2000);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Error server running on port ${PORT}`));
