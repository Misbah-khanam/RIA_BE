import express from "express";
import { addBook, retBooks,retBooksDonated } from "../controllers/book.js";


const router = express.Router();

router.post("/add-book", addBook);
router.post("/ret-book", retBooks)
router.post("/ret-book-donated", retBooksDonated)

export default router