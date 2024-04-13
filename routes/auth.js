import express from "express";
import {login , signup, fetchAllUsers, notVerifiedUsers, verify} from '../controllers/auth.js'


const router = express.Router();

router.post("/signup", signup)
router.post("/login" , login)
router.post("/fetchAllUsers" , fetchAllUsers)
router.post('/notVerifiedUsers',notVerifiedUsers)
router.post('/verify',verify)

export default router