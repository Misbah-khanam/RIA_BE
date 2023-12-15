import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: {type:String},
    timestamp: {type: Date,default: Date.now,},
});

export default mongoose.model("Message", messageSchema);