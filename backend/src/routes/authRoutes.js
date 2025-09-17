import express from "express";
import { register, login,forgotPassword,resetPassword,verifyResetToken } from "../controllers/authController.js";
import User from "../models/User.js";

export const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);

export default router;
