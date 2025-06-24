import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { Order, OrderItem, Product } from "@shared/schema";
import { generateRegalynOrderEmailTemplate } from "./regalyn-email-template";

// Load environment variables
try {
  if (fs.existsSync(".env")) {
    const envConfig = dotenv.parse(fs.readFileSync(".env"));
    for (const key in envConfig) {
      if (key.startsWith('EMAIL_') && !process.env[key]) {
        process.env[key] = envConfig[key];
      }
    }
    console.log("Loaded email environment variables from .env file");
  }
} catch (error) {
  console.error(
    "Error loading .env file:",
    error instanceof Error ? error.message : String(error),
  );
}

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp-relay.brevo.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
const EMAIL_USER = process.env.EMAIL_USER || "8a3bac001@smtp-brevo.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "z5dbE7VGfLqh1ZQB";
const EMAIL_FROM = process.env.EMAIL_FROM || "skdhara2222@gmail.com";
const STORE_NAME = process.env.STORE_NAME || "REGALYN";

// Create email transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Log email configuration (for debugging)
console.log("Email Configuration:", {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  user: EMAIL_USER,
  from: EMAIL_FROM,
  storeName: STORE_NAME
});

// Generate order confirmation email
export const sendOrderConfirmationEmail = async (
  order: Order,
  orderItems: OrderItem[],
  products: Product[],
) => {
  try {
    const {
      email,
      orderNumber,
      totalAmount,
      status
    } = order;

    if (!email) {
      console.error("Cannot send order confirmation: Email is missing");
      return { success: false, error: "Email is missing" };
    }

    // Use the new Regalyn email template
    const html = generateRegalynOrderEmailTemplate(
      orderNumber || `RGL-${Date.now()}`,
      status || "confirmed",
      order.customerName || "Valued Customer",
      email,
      orderItems,
      products,
      Number(totalAmount) || 0,
      order
    );

    // Send the email
    const emailResult = await sendEmail(
      email,
      `Order Confirmation #${orderNumber} - ${STORE_NAME}`,
      html
    );
    
    // Return both the email result and the HTML for preview purposes
    return {
      ...emailResult,
      html
    };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Shipping notification email with Regalyn theme
export const sendShippingNotificationEmail = async (
  order: Order,
  trackingId: string
) => {
  try {
    const { email, orderNumber, status } = order;

    if (!email) {
      console.error("Cannot send shipping notification: Email is missing");
      return { success: false, error: "Email is missing" };
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Been Shipped - ${STORE_NAME}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #f1f5f9;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6366f1 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .brand-name {
      font-family: 'Orbitron', monospace;
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 4px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
      color: #cbd5e1;
    }
    .tracking-box {
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 16px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
    }
    .tracking-id {
      font-family: 'Orbitron', monospace;
      font-size: 24px;
      font-weight: 600;
      color: #a855f7;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-name">${STORE_NAME}</h1>
      <p style="font-size: 16px; margin: 0; opacity: 0.9;">Quantum Precision Engineering</p>
    </div>
    
    <div class="content">
      <h2 style="color: #a855f7; margin-bottom: 15px;">Your Timepiece Is On Its Way!</h2>
      
      <p>Dear Valued Customer,</p>
      
      <p>Your premium Regalyn timepiece order #${orderNumber} has been carefully packaged and shipped with quantum-level security.</p>
      
      <div class="tracking-box">
        <h3 style="color: #a855f7; margin-bottom: 10px;">Tracking Information</h3>
        <div class="tracking-id">${trackingId}</div>
        <p style="margin: 15px 0 0; font-size: 14px;">Use this tracking ID to monitor your shipment's progress</p>
      </div>
      
      <p>Your precision timepiece will arrive within 3-5 business days. Each Regalyn watch represents the pinnacle of quantum engineering and timeless design.</p>
      
      <p style="margin-top: 30px; font-style: italic; text-align: center; color: #94a3b8;">
        "Time is the most precious gift. Thank you for choosing Regalyn to measure yours."
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send the email
    const emailResult = await sendEmail(
      email,
      `Your Order Has Been Shipped #${orderNumber} - ${STORE_NAME}`,
      html
    );
    
    return {
      ...emailResult,
      html
    };
  } catch (error) {
    console.error("Error sending shipping notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Send email function
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`Attempting to send email to ${to} with subject "${subject}"`);
    
    const fromName = process.env.EMAIL_FROM_NAME || "REGALYN";
    const mailOptions = {
      from: `"${fromName}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
    };
    
    console.log("Email configuration:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      host: EMAIL_HOST,
      port: EMAIL_PORT
    });
    
    console.log("Email HTML preview (first 100 chars):", html.substring(0, 100) + "...");
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error("Error sending email:", error);
    
    let errorMessage = "Unknown email error";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Email error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};