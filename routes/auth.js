import express from "express";
import { registerUser, userLogin } from "../controller/userController.js";
import verifyToken from "../middleware/verifytoken.js";
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", userLogin)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed successfully' });
});

export default router