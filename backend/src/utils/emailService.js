const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,

  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

exports.sendAlertEmail = async (to, alert) => {
  await transporter.sendMail({
    from: `"CosmicWatch Alerts " <${process.env.ALERT_EMAIL}>`,
    to,
    subject: `🚨 Asteroid Alert: ${alert.name}`,
    text: `
Asteroid Alert 

Name: ${alert.name}
Risk Level: ${alert.risk_level}
Close Approach Date: ${alert.close_approach_date}

NASA Details:
${alert.nasa_jpl_url}

View on CosmicWatch:
${alert.app_url}

Stay curious,
CosmicWatch Team
`,
    html: `
<div style="font-family: Arial, sans-serif; background:#0f172a; color:#e5e7eb; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#020617; border-radius:12px; padding:24px;">
    <h2 style="color:#f87171;">🚨 Asteroid Alert</h2>

    <p>An asteroid matching your alert preferences has been detected.</p>

    <table style="width:100%; margin-top:16px;">
      <tr>
        <td><strong>Name</strong></td>
        <td>${alert.name}</td>
      </tr>
      <tr>
        <td><strong>Risk Level</strong></td>
        <td>${alert.risk_level}</td>
      </tr>
      <tr>
        <td><strong>Close Approach</strong></td>
        <td>${alert.close_approach_date}</td>
      </tr>
    </table>

    <div style="margin-top:24px;">
      <a href="${alert.app_url}"
        style="display:inline-block; padding:12px 20px; background:#6366f1; color:white; border-radius:8px; text-decoration:none;">
        View in CosmicWatch
      </a>
    </div>

    <p style="margin-top:16px;">
      <a href="${alert.nasa_jpl_url}" style="color:#38bdf8;">
        View NASA JPL Details →
      </a>
    </p>

    <hr style="margin:24px 0; border-color:#1e293b;" />

    <p style="font-size:12px; color:#94a3b8;">
      You received this alert because it matches your custom alert preferences.
    </p>
  </div>
</div>
`,
  });
};

exports.sendVerificationEmail = async (to, code, name) => {
  await transporter.sendMail({
    from: `"CosmicWatch Security " <${process.env.ALERT_EMAIL}>`,
    to,
    subject: `🔐 Verify your CosmicWatch Account`,
    html: `
<div style="font-family: Arial, sans-serif; background:#0f172a; color:#e5e7eb; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#020617; border-radius:12px; padding:24px; text-align:center;">
    <h2 style="color:#60a5fa;">Verify your Email</h2>
    <p>Hello ${name},</p>
    <p>Welcome to CosmicWatch! Please use the following code to verify your email address:</p>
    
    <div style="margin: 24px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #facc15; background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px;">
        ${code}
      </span>
    </div>

    <p style="color:#94a3b8; font-size: 14px;">This code will expire in 10 minutes.</p>
    
    <hr style="margin:24px 0; border-color:#1e293b;" />
    
    <p style="font-size:12px; color:#64748b;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  </div>
</div>
`,
  });
};

exports.sendResetPasswordEmail = async (to, link, name) => {
  await transporter.sendMail({
    from: `"CosmicWatch Support " <${process.env.ALERT_EMAIL}>`,
    to,
    subject: `🔑 Reset your Password`,
    html: `
<div style="font-family: Arial, sans-serif; background:#0f172a; color:#e5e7eb; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#020617; border-radius:12px; padding:24px; text-align:center;">
    <h2 style="color:#f87171;">Reset Password</h2>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    
    <div style="margin: 24px 0;">
      <a href="${link}" style="background:#dc2626; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
        Reset Password
      </a>
    </div>

    <p style="color:#94a3b8; font-size: 14px;">This link will expire in 15 minutes.</p>
    
    <hr style="margin:24px 0; border-color:#1e293b;" />
    
    <p style="font-size:12px; color:#64748b;">
      If you didn't request a password reset, please ignore this email.
    </p>
  </div>
</div>
`,
  });
};
