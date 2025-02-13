import nodemailer from "nodemailer"
import {AppError} from "../../types/custom.types.js";


const sendMail = async (senderEmail: string, otp: string) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(senderEmail)) {
    throw new AppError('Invalid email address format', 400);
  }

  //TODO: remove in production
  console.log("OTP:", otp);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASS,
    },
  });

  try {
    // Verify transporter connection
    await transporter.verify();
  } catch (error) {
    throw new AppError('Email service not available', 500);
  }

  // Update the HTML template to fix formatting issues
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Reset default styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                width: 100%;
                padding: 20px 0;
            }
            
            .container {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 30px;
                max-width: 500px;
                width: 90%;
                margin: 0 auto;
                text-align: center;
            }
            
            .logo {
                color: #4A90E2;
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            
            .otp {
                background-color: #4A90E2;
                color: white;
                padding: 15px 25px;
                font-size: 32px;
                letter-spacing: 10px;
                border-radius: 5px;
                margin: 20px auto;
                display: table;
            }
            
            .message {
                color: #333;
                font-size: 16px;
                margin: 20px 0;
                line-height: 1.5;
            }
            
            .footer {
                color: #888;
                font-size: 12px;
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Kala Vithi</div>
            <div class="message">Your One-Time Password (OTP) is:</div>
            <div class="otp">${otp}</div>
            <div class="message">This OTP will expire in 10 minutes.<br>Do not share it with anyone.</div>
            <div class="footer">© 2025 KalaVithi. All rights reserved.</div>
        </div>
    </body>
    </html>
    `;

  try {
    const info = await transporter.sendMail({
      from: `"KalaVithi" <${process.env.NODEMAIL_EMAIL}>`,
      to: senderEmail,
      subject: "Your KalaVithi Login OTP",
      text: `Your OTP is: ${otp}`,
      html: htmlTemplate,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error: any) {
    if (error.code === 'EENVELOPE') {
      throw new AppError('Invalid recipient email address', 400);
    }
    throw new AppError('Failed to send email', 500);
  }
}

export default sendMail;