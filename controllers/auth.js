import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import users from '../models/user.js'

export const signup = async(req, res) => {
    console.log(req.body)
    const {name,username,email,password} = req.body;
    try{
        const existinguser = await users.findOne({email})
        console.log(existinguser)
        if(existinguser){
            return res.status(404).json({message: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await users.create({name, username, email, password:hashedPassword })
        const token = jwt.sign({email: newUser.email, id: newUser._id},process.env.JWT_SECRET,{expiresIn: '1h'})
        res.status(200).json({result: newUser, token})
    }catch(error){
        res.status(500).json("Something went wrong")
    }
}

export const login = async(req, res) => {
    const {email,password} = req.body;
    try{
        const existinguser = await users.findOne({email})
        if(!existinguser){
            return res.status(404).json({message: "User don't exist"})
        }

        const isPasswordCrct = await bcrypt.compare(password, existinguser.password)
        if(!isPasswordCrct){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({email: existinguser.email, id: existinguser._id},process.env.JWT_SECRET,{expiresIn: '1h'})
        res.status(200).json({result: existinguser, token})
    }catch(error){
        res.status(500).json("Something went wrong......")
    }
}

export const fetchAllUsers = async(req, res) => {
    try{
        const allUsers = await users.find()
        res.status(200).json({users: allUsers})

    }catch(error){
        res.status(500).json("Something went wrong......")
    }
}