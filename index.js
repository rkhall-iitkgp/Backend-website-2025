import bodyParser from 'body-parser';
import express from 'express';
import pg from "pg";
import authRouter from "./routes/auth.js";


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.use("/auth", authRouter);

app.listen(PORT, ()=>{
    console.log(`SERVER started on PORT ${PORT}...`);
})

