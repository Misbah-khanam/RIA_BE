import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    usertype: {type: String, required: true},
    idproof: { 
        data: Buffer, 
        contentType: String 
    },
    verified: {type: String, required: true},
    password: {type: String, required: true},
    joinedOn: {type:Date, default: Date.now},
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
})

export default mongoose.model("User", userSchema);