import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            email,
            password: hashedpassword
        })
        await user.save()
        res.status(201).json({message: "User registered successfully"})
    }
    catch(err){
        res.status(500).json(err.message)
    }
}

export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) return res.status(404).json({message: "inviald credential"})
        
        const validpassword = await bcrypt.compare(password, user.password)
        if (!validpassword) return res.status(404).json({message: "invalid credential"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1hr"})
        res.status(200).json({token})
    }
    catch(err){
        res.status(500).json(err.message)
    }
}