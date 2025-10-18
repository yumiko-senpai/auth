import express from "express";
import dbConnect from "./db.js";
import dotenv from "dotenv";
import router from "./routes/studentRoute.js"

dotenv.config();

const app = express();
app.use(express.json())
dbConnect()
app.use("/api/student", router)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is running`));
