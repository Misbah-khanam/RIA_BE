import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
import bodyParser from 'body-parser'
import multer from 'multer'

const app = express();
dotenv.config();
app.use(cors());

app.get("/",(req, res) =>{
    res.send("this is ria api")
})

// app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

var upload = multer({ dest: './uploads' });

app.use('/user',authRoutes)
app.use('/book', upload.any(), bookRoutes)

const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))

// io.on('connection', (socket) => {
//     console.log('New user connected');
    
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
//     });