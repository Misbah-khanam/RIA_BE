import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import users from '../models/user.js'

export const signup = async(req, res) => {
    console.log(req.body)
    const {name,username,email,password, usertype, verified} = req.body;
    try{
        const existinguser = await users.findOne({email})
        console.log(existinguser)
        if(existinguser){
            return res.status(404).json({message: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await users.create({name, username, email, password:hashedPassword,usertype,verified })
        newUser.idproof.data = readFileSync(req.files[0].path)
        newUser.idproof.contentType = 'image/png';
        newUser.save();
        // const token = jwt.sign({email: newUser.email, id: newUser._id},process.env.JWT_SECRET,{expiresIn: '1h'})
        res.status(200).json({result: newUser})
    }catch(error){
        console.log(error)
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
        if(existinguser.verified === "notverified"){
            return res.status(400).json({message: "User request is not yet approved"})
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

export const verify = async(req, res) => {
    const {email} = req.body
    try{
        const verified_user = await users.updateOne({email: email},{ $set: { verified: 'verified'}})
        res.status(200).json({result: verified_user})
    }catch(error){
        res.status(500).json("Something went wrong......")
    }
}

export const notVerifiedUsers = async(req, res) => {
    try{
        const unverified_users = await users.find({ verified: 'notverified'})

        var imgs = []
        for(var i=0;i<unverified_users.length;i++){
            var base64Image = unverified_users[i].idproof.data.toString('base64');
            imgs.push(base64Image)
        }

        res.status(200).json({result: unverified_users, imgs:imgs})
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