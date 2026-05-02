const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your_')) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  } else {
    // Dev: Log to console
    transporter = {
      sendMail: async (options) => {
        console.log(`[Mock Email] To: ${options.to} | Subject: ${options.subject}`);
        return { messageId: 'mock-' + Date.now() };
      },
    };
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `TravelMate <${process.env.EMAIL_USER || 'noreply@travelmate.com'}>`,
      to, subject,
      html: html || `<p>${text}</p>`,
    });
    return info;
  } catch (err) {
    console.error(`Email send error: ${err.message}`);
    throw err;
  }
};

module.exports = sendEmail;
