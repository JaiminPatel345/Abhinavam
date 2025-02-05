var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
const sendMail = (senderEmail, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAIL_EMAIL,
            pass: process.env.NODEMAIL_PASS,
        },
    });
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 30px;
                max-width: 500px;
                width: 100%;
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
                display: inline-block;
                padding: 15px 25px;
                font-size: 32px;
                letter-spacing: 10px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .message {
                color: #333;
                font-size: 16px;
                margin-bottom: 20px;
            }
            .footer {
                color: #888;
                font-size: 12px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Kala Vithi</div>
            <div class="message">Your One-Time Password (OTP) is:</div>
            <div class="otp">${otp}</div>
            <div class="message">This OTP will expire in 10 minutes. Do not share it with anyone.</div>
            <div class="footer">© 2025 KalaVithi . All rights reserved.</div>
        </div>
    </body>
    </html>
    `;
    const info = yield transporter.sendMail({
        from: `"KalaVithi" <${process.env.NODEMAIL_EMAIL}>`,
        to: senderEmail,
        subject: "Your KalaVithi Login OTP",
        text: `Your OTP is: ${otp}`,
        html: htmlTemplate,
    });
    console.log("Message sent: %s", info.messageId);
});
export default sendMail;
//# sourceMappingURL=sendMail.js.map