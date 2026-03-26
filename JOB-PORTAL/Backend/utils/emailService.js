import nodemailer from "nodemailer";

// Create transporter — uses env vars for SMTP config
// In development, logs emails to console instead of sending
const createTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    // Strip spaces from password if present (common in Google App Passwords)
    const pass = process.env.SMTP_PASS.replace(/\s+/g, "");
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: (process.env.SMTP_PORT || "587") === "465",
      logger: true, // Log to console
      debug: true, // Include debug output
      auth: {
        user: process.env.SMTP_USER,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false // Helps with some network environments
      }
    });
  }
  return null;
};

/**
 * Send email with fallback to console logging in development
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📧 [EMAIL SERVICE – Dev Mode]`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${text || "(HTML email)"}\n`);
    return { success: true, dev: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"HireSphere" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
};

// Pre-built email templates
export const emailTemplates = {
  applicationSubmitted: (userName, jobTitle, companyName) => ({
    subject: `Application Submitted – ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">Hire<span style="color: #ea580c;">Sphere</span></h1>
        </div>
        <h2>Application Submitted! 🎉</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
        <p>We'll notify you when there's an update on your application status.</p>
        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">This is an automated email from HireSphere. Please do not reply.</p>
        </div>
      </div>
    `,
    text: `Hi ${userName}, your application for ${jobTitle} at ${companyName} has been submitted.`,
  }),

  applicationStatusUpdate: (userName, jobTitle, status) => ({
    subject: `Application ${status === "accepted" ? "Accepted ✅" : "Update"} – ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">Hire<span style="color: #ea580c;">Sphere</span></h1>
        </div>
        <h2>Application ${status === "accepted" ? "Accepted! 🎉" : "Update"}</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> has been <strong style="color: ${
      status === "accepted" ? "#22c55e" : "#ef4444"
    };">${status}</strong>.</p>
        ${
          status === "accepted"
            ? "<p>Congratulations! The recruiter will reach out to you soon with next steps.</p>"
            : "<p>Don't be discouraged! Keep applying to find the perfect match for your skills.</p>"
        }
        <a href="http://localhost:5173/dashboard" style="display: inline-block; margin-top: 15px; padding: 10px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">View Dashboard</a>
        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">This is an automated email from HireSphere.</p>
        </div>
      </div>
    `,
    text: `Hi ${userName}, your application for ${jobTitle} has been ${status}.`,
  }),

  welcomeEmail: (userName) => ({
    subject: "Welcome to HireSphere! 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">Hire<span style="color: #ea580c;">Sphere</span></h1>
        </div>
        <h2>Welcome to HireSphere! 🎉</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Welcome aboard! Your account has been created successfully.</p>
        <p>Start exploring thousands of curated job opportunities from top companies.</p>
        <a href="http://localhost:5173/Jobs" style="display: inline-block; margin-top: 15px; padding: 10px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">Browse Jobs</a>
      </div>
    `,
    text: `Hi ${userName}, welcome to HireSphere! Start exploring job opportunities.`,
  }),

  passwordResetEmail: (userName, resetCode) => ({
    subject: "Password Reset Code – HireSphere",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">Hire<span style="color: #ea580c;">Sphere</span></h1>
        </div>
        <h2>Password Reset 🔒</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your password reset code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed; background: #f3f4f6; padding: 12px 24px; border-radius: 8px;">${resetCode}</span>
        </div>
        <p>This code expires in <strong>15 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Hi ${userName}, your password reset code is: ${resetCode}. It expires in 15 minutes.`,
  }),
};
