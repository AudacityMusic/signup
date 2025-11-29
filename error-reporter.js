require('dotenv').config();
const nodemailer = require('nodemailer');

const ENABLE_REPORTING = process.env.ENABLE_ERROR_REPORTING === 'true';
const REPORT_TIMEOUT_MS = parseInt(process.env.REPORT_TIMEOUT_MS || '8000', 10);

function safeStringify(obj) {
  try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
}

let transporter = null;
if (ENABLE_REPORTING) {
  transporter = nodemailer.createTransport({
    service: process.env.EXPO_EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EXPO_EMAIL_USER,
      pass: process.env.EXPO_EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) console.error('Email transporter verification failed:', err);
    else console.log('Email transporter ready');
  });
} else {
  console.log('Error reporting is DISABLED (ENABLE_ERROR_REPORTING != "true")');
}

async function sendErrorEmail(payload = {}) {
  if (!ENABLE_REPORTING) {
    console.log('sendErrorEmail called but reporting is disabled. Summary:', {
      message: payload && (payload.message || payload.errorMessage),
      type: payload && payload.type,
      ts: new Date().toISOString(),
    });
    return { ok: false, disabled: true };
  }

  try {
    if (!payload || typeof payload !== 'object') payload = { errorMessage: String(payload) };

    const errorMessage = payload.stack || payload.errorMessage || payload.message || safeStringify(payload);
    const mailOptions = {
      from: process.env.EXPO_EMAIL_USER,
      to: process.env.EXPO_EMAIL_TO,
      subject: `[ERROR] ${payload.type || 'app'} ${new Date().toISOString()}`,
      text: [
        `Time: ${new Date().toISOString()}`,
        `PID: ${process.pid}`,
        `ENV: ${process.env.NODE_ENV || 'development'}`,
        `User: ${payload.userName || 'unknown'}`,
        `User ID: ${payload.userId || 'unknown'}`,
        `Platform: ${payload.platform || 'unknown'}`,
        `App Version: ${payload.appVersion || 'unknown'}`,
        '',
        'Error:',
        errorMessage,
        '',
        'Context:',
        safeStringify(payload.context || {}),
      ].join('\n'),
    };

    const sendPromise = transporter.sendMail(mailOptions);
    const result = await Promise.race([
      sendPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), REPORT_TIMEOUT_MS)),
    ]);
    if (result) {
      console.log('Error email sent:', result.messageId || result);
      return { ok: true };
    } else {
      console.warn('sendErrorEmail: send timed out or returned no result');
      return { ok: false, timeout: true };
    }
  } catch (err) {
    console.error('sendErrorEmail internal error:', err);
    return { ok: false, error: String(err) };
  }
}

function expressMiddleware(err, req, res, next) {
  const payload = {
    type: 'express-error',
    message: err && err.message,
    stack: err && err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user && req.user.id,
    context: {
      headers: req.headers,
    },
  };

  sendErrorEmail(payload).catch((e) => console.error('Reporter: failed to send email:', e));

  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal Server Error' });
}

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function initProcessHandlers({ exitAfterReport = true, enableReporting = ENABLE_REPORTING, timeoutMs = 2000 } = {}) {
  const shouldAttach = enableReporting === true;

  if (!shouldAttach) {
    console.log('initProcessHandlers: not attaching process handlers (reporting disabled)');
    return { stop: () => {} };
  }

  async function handleFatal(errOrReason, type) {
    try {
      console.error(type + ':', errOrReason && (errOrReason.stack || String(errOrReason)));
      const payload = {
        type,
        errorMessage: errOrReason && (errOrReason.stack || String(errOrReason)),
        context: { ts: new Date().toISOString() },
      };
      await Promise.race([sendErrorEmail(payload), new Promise((r) => setTimeout(r, timeoutMs))]);
    } catch (e) {
      console.error('initProcessHandlers: reporting failure', e);
    } finally {
      if (exitAfterReport) setTimeout(() => process.exit(1), 500);
    }
  }

  function uncaughtListener(err) { handleFatal(err, 'uncaughtException'); }
  function unhandledRejectionListener(reason) { handleFatal(reason, 'unhandledRejection'); }

  process.on('uncaughtException', uncaughtListener);
  process.on('unhandledRejection', unhandledRejectionListener);

  return {
    stop: () => {
      process.removeListener('uncaughtException', uncaughtListener);
      process.removeListener('unhandledRejection', unhandledRejectionListener);
    },
  };
}

module.exports = {
  sendErrorEmail,
  expressMiddleware,
  asyncHandler,
  initProcessHandlers,
  ENABLE_REPORTING,
};