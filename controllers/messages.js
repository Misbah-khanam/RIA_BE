import Message from "../models/messages.js";
import {io, socketMap} from "../socket.js";

export const sendMessage = async(req, res) => {
    const { receiver, content, sender } = req.body;

    try {
        const newMessage = new Message({
            sender: sender,
            receiver: receiver,
            content,
        });

        await newMessage.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const recieveMessage = async(req, res) => {

    const { receiver, sender } = req.body;
    try {
        const messages = await Message.find({
        $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender },
        ],
        }).sort({ timestamp: 1 });

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}