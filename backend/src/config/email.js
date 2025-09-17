import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : undefined,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : undefined,
    },
});
// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode) => {
    try {
        // Use the transporter defined above
        const mailer = transporter;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OrderKing password reset code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Code</h2>
                    <p>Use the code below to reset your OrderKing password:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">${resetCode}</div>
                    <p>This code will expire in 1 hour.</p>
                    <p>If you didn't request this reset, you can ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        OrderKing Team<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            `,
        };

        await mailer.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset email');
    }
};export default nodemailer;