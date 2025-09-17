import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./lib/DBconnect.js";
import authRoutes from "./routes/authRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 6202;
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});