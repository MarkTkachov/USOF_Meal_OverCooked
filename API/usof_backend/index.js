/* eslint-disable no-undef */
import sequelize from "./db.js";
import express, { json, urlencoded } from 'express';
const app = express();
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';


try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.');
    await sequelize.sync(/*{alter: true}*/);
} catch (error) {
    console.log(error);
    console.log(`Can't connect to the database`);
    process.exit(1);
}

const PORT = process.env.PORT;

import authRouter from './controllers/auth/router.js';
import userRouter from './controllers/users/router.js';
import categoryRouter from './controllers/categories/router.js';
import commentRouter from './controllers/comments/router.js';
import postRouter from './controllers/posts/router.js';
import filesRouter from './controllers/files/router.js';


app.use(fileUpload());
app.use(cors({
    credentials:true,
    origin:true
}));
app.use(cookieParser());


app.use(json());
app.use(urlencoded({extended: true}));

app.use('/api/files/image', express.static('./resources/post_images'));
app.use('/api/files/image', filesRouter);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);

app.listen(PORT, () => {
    console.log(`USOF backend started on http://localhost:${PORT}`);
})

