import books from '../models/books.js'
import { readFileSync } from 'fs'
import users from '../models/user.js'

export const addBook = async(req, res) => {
    const{book_name,author,seller_name,seller_phone,seller_email,seller_state,seller_district,actual_price,selling_price,status, category} =  req.body
    try{
        const newBook = await books.create({
            book_name,author,seller_name,seller_phone,seller_email,seller_state,seller_district,actual_price,selling_price,status, category
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
          const searchResults = await books.find({ status: "sell" });
          // If no searchTerm provided, return all books with status "sell"
          var imgs = [];
          for (var i = 0; i < searchResults.length; i++) {
              var base64Image = searchResults[i].img.data.toString('base64');
              imgs.push(base64Image);
          }
          return res.status(200).json({ books: searchResults, img: imgs });
      }

      // Search by book name, author name, and category
      const searchResults = await books.find({
          $or: [
              { book_name: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
              { author_name: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
              { category: { $regex: `.*${searchTerm}.*`, $options: 'i' } }
          ],
          status: "sell"
      });
      
      var imgs = [];
      for (var i = 0; i < searchResults.length; i++) {
          var base64Image = searchResults[i].img.data.toString('base64');
          imgs.push(base64Image);
      }
      
      res.status(200).json({ books: searchResults, img: imgs });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getFavorites = async (req, res) => {
  try {
    const { bookIds } = req.body;

    // Fetch books from the database based on book IDs
    const matchingBooks = await books.find({ _id: { $in: bookIds } });

    var imgs = []
    for(var i=0;i<matchingBooks.length;i++){
        var base64Image = matchingBooks[i].img.data.toString('base64');
        imgs.push(base64Image)
    }

    res.status(200).json({'matchingBooks':matchingBooks,'imgs':imgs});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
  
  export const addFavorite = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    // Assuming `req.user._id` is the ID of the authenticated user
    // const userId = req.user._id;
    await users.findByIdAndUpdate(userId, { $addToSet: { favorites: bookId } });
    const user_ret = await users.findOne({ _id: userId });
    res.status(200).json({ message: 'Book added to favorites', user: user_ret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    // Assuming `req.user._id` is the ID of the authenticated user
    // const userId = req.user._id;
    await users.findByIdAndUpdate(userId, { $pull: { favorites: bookId } });
    const user_ret = await users.findOne({ _id: userId });
    res.status(200).json({ message: 'Book removed from favorites', user: user_ret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


  export const fetchAddedBooks = async (req, res) => {
    try {
      const { seller } = req.body;
  
      // Ensure seller is a string
      const sellerName = String(seller);
  
      // Fetch books from the database based on seller_name
      const addedBooks = await books.find({ seller_name: sellerName });
  
      var addedImgs = [];
      for (var i = 0; i < addedBooks.length; i++) {
        var base64Image = addedBooks[i].img.data.toString('base64');
        addedImgs.push(base64Image);
      }
  
      res.status(200).json({ 'addedBooks': addedBooks, 'addedImgs': addedImgs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  export const deleteBook = async (req, res) => {
    try {
      const { bookId } = req.body;
  
      // Use findOneAndDelete to find and delete the book
      const deletedBook = await books.findOneAndDelete({ _id: bookId });
  
      if (deletedBook) {
        // Book found and deleted successfully
        return res.status(200).json({ success: true, message: 'Book deleted successfully.' });
      } else {
        // Book not found
        return res.status(404).json({ success: false, message: 'Book not found.' });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  export const updateBook = async (req, res) => {
    try {
      const { bookId, bookName, bookAuthor, bookActualPrice, bookSellingPrice, bookStatus, category } = req.body;
  
      // Use findOneAndDelete to find and delete the book
      const updatedBook = await books.findOneAndUpdate({ _id: bookId },{ $set: {boo_name:bookName, author:bookAuthor, actual_price:bookActualPrice, selling_price:bookSellingPrice, status:bookStatus, category:category} });
  
      if (updatedBook) {
        // Book found and deleted successfully
        return res.status(200).json({ success: true, message: 'Book Updated successfully.' });
      } else {
        // Book not found
        return res.status(404).json({ success: false, message: 'Book not found.' });
      }
    } catch (error) {
      console.error('Error in updating book:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  