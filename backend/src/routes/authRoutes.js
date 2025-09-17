import express from "express";
import { register, login,forgotPassword,resetPassword,verifyResetToken, getUserInfo } from "../controllers/authController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

export const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user-info", authenticateToken, getUserInfo);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);

export default router;
