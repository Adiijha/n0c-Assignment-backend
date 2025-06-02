import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express();

const corsOptions = {
    origin: "http://3.6.9.63",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieparser())

import userRouter from './routes/user.routes.js';
app.use('/user', userRouter);

import dataRouter from './routes/data.routes.js';
app.use('/data', dataRouter);

export { app }