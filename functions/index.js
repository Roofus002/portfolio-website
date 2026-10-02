const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });

const { defineString, defineSecret } = require("firebase-functions/params");

const sgMail = require("@sendgrid/mail");

// ✅ Secret stored in Google Secret Manager
const SENDGRID_KEY = defineSecret("SENDGRID_KEY");

// ✅ Non-secret env param (safe to store in .env)
const FROM_EMAIL = defineString("FROM_EMAIL", { default: "tharuka.ykw@outlook.com" });

exports.contact = onRequest(
  {
    region: "us-central1",
    secrets: [SENDGRID_KEY],
  },
  (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ ok: false, message: "Method not allowed" });
      }

      // Honeypot spam trap
      if (req.body?.website) {
        return res.status(200).json({ ok: true, message: "Thanks!" });
      }

      const name = String(req.body?.name || "").trim();
      const email = String(req.body?.email || "").trim();
      const message = String(req.body?.message || "").trim();

      if (!name || !email || !message) {
        return res.status(200).json({ ok: false, message: "Please fill in all fields." });
      }
      if (message.length < 10) {
        return res.status(200).json({ ok: false, message: "Message is too short (min 10 characters)." });
      }

      try {
        sgMail.setApiKey(SENDGRID_KEY.value());

        await sgMail.send({
          to: "tharuka.ykw@outlook.com",
          from: FROM_EMAIL.value(), 
          replyTo: { email, name },
          subject: `Portfolio Contact — ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return res.status(200).json({ ok: true, message: "✅ Sent! I’ll get back to you soon." });
      } catch (err) {
        logger.error("Email send failed", err);
        return res.status(200).json({
          ok: false,
          message: "Email failed to send. Please try again or email me directly.",
        });
      }
    });
  }
);
