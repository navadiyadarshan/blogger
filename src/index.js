import dotenv from 'dotenv'
import connectDB from './db/connectDb.js';
import app from './app.js';

dotenv.config({path : "./.env"});

connectDB()
.then(app.listen(process.env.PORT || 8000, () => console.log(`server running at PORT ${process.env.PORT}`)))
.catch((error) => console.log("erro: ", error))