import nodemailer from "nodemailer";

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendInviteEmailParams {
  to: string;
  inviterName: string;
  workspaceName: string;
  inviteLink: string;
}

export async function sendWorkspaceInviteEmail({
  to,
  inviterName,
  workspaceName,
  inviteLink,
}: SendInviteEmailParams) {
  const mailOptions = {
    from: `Prism App <${process.env.EMAIL_FROM}>`,
    to,
    subject: `You've been invited to join ${workspaceName} on Prism`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111827;">Join ${workspaceName} on Prism</h2>
        <p style="color: #4b5563; line-height: 1.5;">
          <strong>${inviterName}</strong> has invited you to collaborate with them in the <strong>${workspaceName}</strong> workspace.
        </p>
        <p style="color: #4b5563; line-height: 1.5;">
          Prism is a collaborative project management tool designed to bring clarity to your complex projects.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteLink}" style="background-color: #4955f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This link will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}