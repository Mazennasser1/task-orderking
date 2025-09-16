import User from "../models/User.js";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
}

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
// forgot password
export const forgotPass =async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({message: "Email is required"});
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        // Here you would typically generate a password reset token and send it via email
        res.status(200).json({message: "Password reset link has been sent to your email (not really, this is a placeholder)"});
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};

