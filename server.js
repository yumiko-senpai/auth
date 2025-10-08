import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express()
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.listen(3000, () => console.log('server is up'))

