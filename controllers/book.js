import books from '../models/books.js'
import { readFileSync } from 'fs'

export const addBook = async(req, res) => {
    const{book_name,author,seller_name,seller_phone,seller_email,seller_state,seller_district,actual_price,selling_price,status} =  req.body
    try{
        const newBook = await books.create({
            book_name,author,seller_name,seller_phone,seller_email,seller_state,seller_district,actual_price,selling_price,status
        })
        newBook.img.data = readFileSync(req.files[0].path)
        newBook.img.contentType = 'image/png';
        newBook.save();
        res.status(200).json("successfull")
    }catch(error){
        console.log(error)
        res.status(500).json("Something went wrong")
    }
}

export const retBooks = async(req, res) => {
    try{
        const books_ret = await books.find({status:"sell"})
        var imgs = []
        for(var i=0;i<books_ret.length;i++){
            var base64Image = books_ret[i].img.data.toString('base64');
            imgs.push(base64Image)
        }
        res.status(200).json({books:books_ret, img: imgs})
    }catch(error){
        console.log(error)
        res.status(500).json("something went wrong")
    }
}

export const retBooksDonated = async(req, res) => {
    try{
        const books_ret = await books.find({status:"donate"})
        var imgs = []
        for(var i=0;i<books_ret.length;i++){
            var base64Image = books_ret[i].img.data.toString('base64');
            imgs.push(base64Image)
        }
        res.status(200).json({books:books_ret, img: imgs})
    }catch(error){
        console.log(error)
        res.status(500).json("something went wrong")
    }
}