import http from 'http';
import { Server } from 'socket.io';
import messages from './models/messages.js';
import nodemailer from 'nodemailer'

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('set-username', (username) => {
    socket.username = username;
    socketMap[username] = socket.id;
  });

  socket.on('send-message', async ({ sender, receiver, content }) => {
    try {
      const newMessage = new messages({
        sender: sender._id,
        receiver: receiver._id,
        content,
      });

      await newMessage.save();

      io.to(socket.id).emit('new-message', newMessage);
      io.to(socketMap[receiver.username]).emit('new-message', newMessage);

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : '513215c@gmail.com',
                pass : 'bqyu vmau acfe bqsc'
            }
        })

        const mailOptions = {
            from: "513215c@gmail.com",
            to: receiver.email,
            subject: "Read It Again",
            text: `${sender.username} is waiting for you reply. view messages in "Read It Again" Application`
        }

        transporter.sendMail(mailOptions, (err,info) =>{
            if(err){
                console.log(err)
            }else{
                console.log(info)
                res.send("email sent successfully")
            }
        })


      console.log("message sent")
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Store the mapping between socket ID and username
const socketMap = {};

export { io, socketMap };