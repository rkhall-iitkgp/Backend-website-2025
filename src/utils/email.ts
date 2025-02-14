import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  otp: string
) => {
  console.log(process.env.SMTP_USER, process.env.SMTP_HOST);
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Email Verification',
    html: `
      <h1>Email Verification</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  });
};