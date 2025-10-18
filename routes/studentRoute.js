import express from "express";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  passwordReset,  
  resetPassword,   
} from "../controller/studentController.js";

const router = express.Router();

router.post("/OTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);

router.post("/reset-password", passwordReset);           
router.post("/reset-password/:resetToken", resetPassword)  

export default router;
