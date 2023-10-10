import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import bodyParser from 'body-parser'

const app = express();
dotenv.config();
app.use(cors());

app.get("/",(req, res) =>{
    res.send("this is ria api")
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/user',authRoutes)

const PORT = process.env.PORT || 5000

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))