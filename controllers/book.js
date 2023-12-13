import books from '../models/books.js'
import { readFileSync } from 'fs'
import users from '../models/user.js'

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

export const searchBooks = async (req, res) => {
    try {
      const { searchTerm } = req.body;
  
      if (!searchTerm) {
        const searchResults = await books.find({
            status:"sell"
        });
      }
  
      // Adjusted $regex pattern to make the search less restrictive
      const searchResults = await books.find({
        book_name: { $regex: `.*${searchTerm}.*`, $options: 'i' },
        status:"sell"
      });
      var imgs = []
      for(var i=0;i<searchResults.length;i++){
        var base64Image = searchResults[i].img.data.toString('base64');
        imgs.push(base64Image)
      }
      res.status(200).json({ books: searchResults, img: imgs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  export const getFavorites = async (req, res) => {
    try {
      const favorites = await books.find({ _id: { $in: req.user.favorites } });
      // Assuming `req.user.favorites` is an array of book IDs
      res.status(200).json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  export const addFavorite = async (req, res) => {
    try {
      const { bookId, user } = req.body;
      // Assuming `req.user._id` is the ID of the authenticated user
      console.log(user._id);
      await users.findByIdAndUpdate(user._id, { $addToSet: { favorites: bookId } });
      const user_ret = await users.findOne({_id: user._id })
      res.status(200).json({ message: 'Book added to favorites', user: user_ret  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  export const removeFavorite = async (req, res) => {
    try {
      const { bookId, user } = req.body;
      // Assuming `req.user._id` is the ID of the authenticated user
      await users.findByIdAndUpdate(user._id, { $pull: { favorites: bookId } });
      const user_ret = await users.findOne({_id: user._id })
      res.status(200).json({ message: 'Book removed from favorites', user: user_ret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };