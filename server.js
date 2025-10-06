import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import verifyToken from "./middleware/verifytoken.js";

const app = express()
connectDB()

app.use(express.json())
app.use("/api/auth", authRoutes)

app.listen(3000, () => console.log('server is up'))

