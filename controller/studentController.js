import Student from "../models/student.js";
import TempUser from "../models/tempUser.js";
import transporter from "../utils/sendEmails.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await TempUser.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      text: otp,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { username, email, password, otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) return res.status(400).json({ message: "No OTP found for this email" });
    if (tempUser.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (tempUser.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({ username, email, password: hashedPassword });
    const accessToken = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    await TempUser.deleteOne({ email });

    res.status(201).json({ message: "User registered successfully", accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const tempUser = await TempUser.findOne({ email });

    if (tempUser) {

      const timeSinceLast = Date.now() - tempUser.updatedAt.getTime();
      if (timeSinceLast < 60 * 1000) {
        const secondsLeft = Math.ceil((60 * 1000 - timeSinceLast) / 1000);
        return res.status(429).json({
          message: `Please wait ${secondsLeft}s before requesting a new OTP.`,
        });
      }
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await TempUser.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      to: email,
      subject: "Your new verification OTP",
      text: otp,
    });

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const passwordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const existingStudent = await Student.findOne({ email });
    if (!existingStudent) {
      return res.status(400).json({ message: "No student with that email is registered" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    existingStudent.resetToken = resetToken;
    existingStudent.resetTokenExpiry = Date.now() + 300000;
    await existingStudent.save();

    const resetUrl = `http://${req.headers.host}/api/student/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    const existingStudent = await Student.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!existingStudent) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    existingStudent.password = hashedPassword;
    existingStudent.resetToken = undefined;
    existingStudent.resetTokenExpiry = undefined;
    await existingStudent.save(); 

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
