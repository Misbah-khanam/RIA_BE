import express from "express";
import { sendMessage, recieveMessage } from "../controllers/messages.js";

const router = express.Router();

router.post("/sendMessage", sendMessage)
router.post("/recieveMessage" , recieveMessage)

export default router