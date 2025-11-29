// Simple Express server that accepts error reports and emails them using nodemailer
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const EMAIL_USER = process.env.EXPO_EMAIL_USER || process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EXPO_EMAIL_PASS || process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EXPO_EMAIL_TO || process.env.EMAIL_TO;
const PORT = process.env.PORT || 3000;

if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  console.warn(
    "Warning: EXPO_EMAIL_USER / EXPO_EMAIL_PASS / EXPO_EMAIL_TO not fully set. Emails will fail until configured.",
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send error email. Accepts payload from app with fields:
 * { errorMessage, shortDescription, userId, userName, platform, appVersion, timestamp }
 */
async function sendErrorEmail(payload) {
  const errorMessage = payload?.errorMessage || String(payload) || "No details";
  const shortDesc = payload?.shortDescription ? `${payload.shortDescription}\n\n` : "";
  const subject = `[APP ERROR] ${payload?.shortDescription ? payload.shortDescription : "Automatic report"} - ${new Date().toISOString()}`;

  const text = `
An error report was received:

User: ${payload?.userName || "Anonymous"}
User ID: ${payload?.userId || "unknown"}
Platform: ${payload?.platform || "unknown"}
App Version: ${payload?.appVersion || "unknown"}
Timestamp: ${payload?.timestamp || new Date().toISOString()}

Short description:
${payload?.shortDescription || "N/A"}

Error details:
${errorMessage}
  `;

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Error email sent:", info.messageId || info);
    return info;
  } catch (err) {
    console.error("Failed to send error email:", err);
    throw err;
  }
}

app.post("/send-error", async (req, res) => {
  const payload = req.body || {};
  try {
    await sendErrorEmail(payload);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (_req, res) => res.send("Error server running"));

// Catch unhandled rejections and uncaught exceptions in the server process
function extractErrorMessage(err) {
  if (!err) return String(err);
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    // try to read stack/message safely
    try {
      // access properties only when present to avoid TS/strict errors
      if ("stack" in err && (err.stack || err.message)) return err.stack || err.message;
      if ("message" in err && err.message) return err.message;
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

process.on("unhandledRejection", async (reason, promise) => {
  try {
    console.error("Unhandled Rejection:", reason);
    await sendErrorEmail({
      errorMessage: extractErrorMessage(reason),
      shortDescription: "Server unhandledRejection",
      platform: "error-server",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Failed to email unhandledRejection:", e);
  }
});

// Express error-handling middleware: emails when a route throws
app.use(async (err, req, res, next) => {
  try {
    console.error("Express error:", err);
    await sendErrorEmail({
      errorMessage: extractErrorMessage(err),
      shortDescription: `Express route error ${req.method} ${req.originalUrl}`,
      userId: req.body?.userId || "n/a",
      userName: req.body?.userName || "n/a",
      platform: "error-server",
      appVersion: "server",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Failed to email express error:", e);
  }
  // respond with generic error
  res.status(500).json({ success: false, error: "Internal server error" });
});
// duplicate error-handling block removed (err was referenced outside middleware)

app.listen(PORT, () => {
  console.log(`Error server listening on port ${PORT}`);
});