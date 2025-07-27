import express from "express"; 
import cors from "cors";
import dotenv from "dotenv/config";
import cookieParser from "cookie-parser";
import connectdb from "./config/db.js";

const app = express();
const port = process.env.PORT || 4000 ;
connectdb();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// API ROUTES IMPORT
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"

// API ROUTES
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.use('/', (req,res) => res.send("Api Working") )

app.listen(port, ()=>{
    console.log(`app is running at ${port}`);
})