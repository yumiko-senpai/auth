import express from "express";
import { registerUser, userLogin, getNewAccessToken } from "../controller/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import csrfProtection from "../middleware/csrfToken.js";
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", userLogin)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed successfully' });
});
router.post("/refresh", getNewAccessToken)
router.get("/csrf", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

export default router