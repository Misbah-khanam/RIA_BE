import express from "express";
import {login , signup, fetchAllUsers} from '../controllers/auth.js'


const router = express.Router();

router.post("/signup", signup)
router.post("/login" , login)
router.post("/fetchAllUsers" , fetchAllUsers)

export default router