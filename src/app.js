import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
const app = express();

import userRoutes from './routes/user.route.js'
import blogRoutes from './routes/blogs.route.js'

app.use(express.json());
app.use(express.urlencoded({extended :true}));
app.use(cookieParser());
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}));

app.use("/user/auth", userRoutes)
app.use("/blog", blogRoutes)

export default app;