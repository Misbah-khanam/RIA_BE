import express from "express";
import { addBook, retBooks,retBooksDonated, searchBooks, getFavorites, addFavorite, removeFavorite } from "../controllers/book.js";


const router = express.Router();

router.post("/add-book", addBook);
router.post("/ret-book", retBooks)
router.post("/ret-book-donated", retBooksDonated)
router.post('/search', searchBooks);
router.post('/favorites', getFavorites);
router.post('/addFavorite', addFavorite);
router.post('/removeFavorite', removeFavorite);

export default router