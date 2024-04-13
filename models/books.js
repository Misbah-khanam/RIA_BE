import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    book_name: {type: String},
    author : {type: String},
    seller_name : {type: String, required: true},
    seller_phone : {type: String, required: true},
    seller_email : {type: String, required: true},
    seller_state : {type: String, required: true},
    seller_district : {type: String, required: true},
    actual_price : {type: String, required: true},
    selling_price : {type: String, required: true},
    status : {type: String, required: true},
    category : {type: String, required: true},
    postedOn: {type:Date, default: Date.now},
    img: { 
        data: Buffer, 
        contentType: String 
    }
})

export default mongoose.model("Book", bookSchema);