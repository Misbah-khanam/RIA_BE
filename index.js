import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
import messageRoutes from './routes/messages.js'
import bodyParser from 'body-parser'
import multer from 'multer'
import {io} from './socket.js';

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://ria-fe.onrender.com',
    optionsSuccessStatus: 200, 
};

const app = express();
dotenv.config();
app.use(cors(corsOptions));

io.attach(app.listen(5000, () => {console.log(`server running on port ${5000}`)}));

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
app.use('/message',messageRoutes)

// const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>  {console.log("connected to mongodb")})
    .catch((err) => console.log(err.message))
