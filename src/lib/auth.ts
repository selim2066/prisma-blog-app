import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// If your Prisma file is located elsewhere, you can change the path
//import { PrismaClient } from "@/generated/prisma/client";

//const prisma = new PrismaClient();

// !nodemailer for sending emails
//? transporter configuration

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER_EMAIL!,
    pass: process.env.APP_USER_EMAIL_PASSWORD!,
  },
});




export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
    
      const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;
     
      const info = await transporter.sendMail({
        from: `"blogpostPrisma" <${process.env.APP_USER_EMAIL}>`,
        to: user.email,
        subject: "Please verify your email address",
        text: "Assalamu Alaikum. Please verify your email.",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #1e293b;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
      color: #374151;
      font-size: 16px;
      line-height: 1.6;
    }
    .btn-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #6b7280;
      background-color: #f9fafb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Email Verification</div>

    <div class="content">
      <p><strong>Assalaamu Alaikum ${user.name ?? "dear"},</strong></p>

      <p>
        Thank you for registering with <strong>blogpostPrisma</strong>.
        Please verify your email address to activate your account.
      </p>

      <div class="btn-wrapper">
        <a href="${verificationURL}" class="btn">Verify Email</a>
      </div>

      <p>
        If the button does not work, copy and paste this link:
      </p>

      <p style="word-break: break-all;">
        <a href="${verificationURL}">${verificationURL}</a>
      </p>

      <p>If you did not create this account, you can safely ignore this email.</p>

      <p>
        Regards,<br />
        <strong>blogpostPrisma Team</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} blogpostPrisma. All rights reserved.
    </div>
  </div>
</body>
</html>
`,
      });

      console.log("Email sent:", info.messageId);
      console.log(user, url, token);
    },
  },
});
