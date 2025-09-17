import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = express.Router();

// keep the current UUID in memory
let currentUUID = uuidv4();

// refresh every 60s
setInterval(() => {
    currentUUID = uuidv4();
}, 60 * 1000);
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// protected route
router.get("/current",  authenticateToken,(req, res) => {
    res.json({ uuid: currentUUID });
});

export default router;
