import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/email.js";


const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
}
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};


// Register a new user
export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "Username, email and password are required"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already in use"});
        }
        const newUser = new User({username, email, password});
        await newUser.save();
        const token = generateToken(newUser);
        res.status(201).json({
            token,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};
// login a user
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        const user = await  User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid password"});
        }
        const token = generateToken(user);
        res.status(200).json({
            token,
            message: "Successfully logged in",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }catch (err){
        res.status(500).json({message: "Server error", error: err.message});
    }

};
// Forgot password - send reset email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if email exists or not
            return res.status(200).json({
                message: "If the email exists, a password reset link has been sent"
            });
        }

        // Generate 6-digit numeric code and expiry (1 hour)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save reset code to user (reuse existing fields)
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send email
        try {
            await sendPasswordResetEmail(email, resetCode);
            return res.status(200).json({
                message: "Password reset code has been sent to your email"
            });
        } catch (emailError) {
            console.error("Email sending error:", emailError.message);
            // Remove the reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();


            return res.status(500).json({
                message: "Failed to send reset email. Please try again."
            });
        }

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                message: "Email, code, and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset code"
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "Password has been reset successfully"
        });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
export const verifyResetToken = async (req, res) => {
    try {
        const { token, userId } = req.body;

        if (!token || !userId) {
            return res.status(400).json({
                message: "Token and user ID are required"
            });
        }

        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        res.status(200).json({
            message: "Reset token is valid",
            valid: true
        });

    } catch (err) {
        console.error("Verify token error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
