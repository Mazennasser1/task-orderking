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
export const sendPasswordResetEmail = async (email, resetToken, userId) => {
    try {
        // Use the transporter defined above
        const mailer = transporter;

        const resetLink = `http://192.168.1.6:2025/reset-password?token=${resetToken}&userId=${userId}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - OrderKing',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You requested to reset your password for your OrderKing account.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 12px 24px; 
                              background-color: #007bff; color: white; 
                              text-decoration: none; border-radius: 4px;
                              margin: 16px 0;">
                        Reset Password
                    </a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
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