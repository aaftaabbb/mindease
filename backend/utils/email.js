const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendBookingConfirmation({ to, userName, clinicName, city, date, time, reason }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f23; color: #e0e0e0; border-radius: 16px; overflow: hidden; border: 1px solid rgba(155,140,255,0.2);">
      <div style="background: linear-gradient(135deg, #9b8cff, #7b6de0); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">🧠 MindEase</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Booking Confirmation</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Hi <strong style="color: #f5c97a;">${userName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #b0b0b0;">
          Your appointment has been <strong style="color: #5ecfaa;">successfully booked</strong>. Here are the details:
        </p>
        <div style="background: rgba(155,140,255,0.08); border: 1px solid rgba(155,140,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #9b8cff; font-weight: 600; width: 100px;">Clinic</td>
              <td style="padding: 6px 0; color: #e0e0e0;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9b8cff; font-weight: 600;">City</td>
              <td style="padding: 6px 0; color: #e0e0e0;">${city}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9b8cff; font-weight: 600;">Date</td>
              <td style="padding: 6px 0; color: #e0e0e0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9b8cff; font-weight: 600;">Time</td>
              <td style="padding: 6px 0; color: #e0e0e0;">${time}</td>
            </tr>
            ${reason ? `<tr>
              <td style="padding: 6px 0; color: #9b8cff; font-weight: 600;">Reason</td>
              <td style="padding: 6px 0; color: #e0e0e0;">${reason}</td>
            </tr>` : ''}
          </table>
        </div>
        <p style="font-size: 13px; line-height: 1.6; margin: 0 0 16px; color: #888;">
          Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, you can do so from the MindEase app.
        </p>
        <p style="font-size: 13px; color: #888; margin: 0; text-align: center; padding-top: 16px; border-top: 1px solid rgba(155,140,255,0.15);">
          Take care of your mental health 💜 — MindEase Team
        </p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `"MindEase" <${process.env.SMTP_USER}>`,
    to,
    subject: `MindEase — Appointment Confirmed at ${clinicName}`,
    html,
  });
}

async function sendBookingCancellation({ to, userName, clinicName, date, time }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f23; color: #e0e0e0; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,123,114,0.2);">
      <div style="background: linear-gradient(135deg, #ff7b72, #e05a52); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">🧠 MindEase</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Booking Cancelled</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Hi <strong style="color: #f5c97a;">${userName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #b0b0b0;">
          Your appointment at <strong style="color: #ff7b72;">${clinicName}</strong> has been cancelled.
        </p>
        <div style="background: rgba(255,123,114,0.08); border: 1px solid rgba(255,123,114,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; margin: 0; color: #e0e0e0;">
            📅 ${formattedDate} at ${time}
          </p>
        </div>
        <p style="font-size: 13px; color: #888; margin: 0; text-align: center; padding-top: 16px; border-top: 1px solid rgba(255,123,114,0.15);">
          You can rebook anytime from the MindEase app 💜
        </p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `"MindEase" <${process.env.SMTP_USER}>`,
    to,
    subject: `MindEase — Appointment Cancelled at ${clinicName}`,
    html,
  });
}

module.exports = { sendBookingConfirmation, sendBookingCancellation };
