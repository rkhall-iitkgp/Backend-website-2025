import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import * as env from "dotenv";
import bodyParser from "body-parser";


const router = express.Router();
env.config();

const saltRounds = 15;
const secretKey = process.env.JWT_SECRET_KEY;

const db = new pg.Client({
    user:process.env.PG_USER,
    host:process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    password:process.env.PG_PASSWORD,
    port:process.env.PG_PORT,
})

db.connect();

router.get("/signup", (req,res)=>{
    res.send("This is register/signup page.");
})

router.post("/signup", async (req,res)=>{

    try {
        const name = req.body.name;
        const instiRollNo = req.body.instiRollNo;
        const phoneNo = req.body.phoneNo;
        const yop = req.body.yop;
        const email = req.body.email;
        const instiEmail = req.body.instiEmail;
        const dob = req.body.dob;
        const department = req.body.department;
        const emergencyPhoneNo = req.body.emergencyPhoneNo;
        const roomNo = req.body.roomNo;
        const password = req.body.password;
    
        const result = await db.query("SELECT * FROM users WHERE institute_email_id = $1", [instiEmail]);
        if(result.rows.length!==0) console.log("User already exists!");
        else{


    bcrypt.hash(password, saltRounds, async(err, hash)=>{
    if(err){
        console.log(err);
    } else {

        
        const query = `
                    INSERT INTO users (
                        name, institute_roll_number, phone_number, year_of_passing,
                        email_id, institute_email_id, date_of_birth, department,
                        emergency_mobile_number, room_number, password
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `;
    
                const values = [
                    name,
                    instiRollNo,
                    phoneNo,
                    yop,
                    email,
                    instiEmail,
                    dob,
                    department,
                    emergencyPhoneNo,
                    roomNo,
                    hash, 
                ];
    
                await db.query(query, values);
                console.log(user);
                console.log(hash);

                res.status(201).json({message: "User registered successfully!"});

    }

})
        
    
}} catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})



router.get("/login",(req,res)=>{
    res.send("This is login page.");
})

router.post("/login", async (req,res)=>{
    const {email, instiEmail, password} = req.body;

    const result = await db.query("SELECT * FROM users where institute_email_id = $1", [instiEmail]);
    if(result.rows.length==0) {
        res.send("User does not exist. Please signup.");
        console.log("User does not exist. Please signup.");

    }
    else if(result.rows.length==1) {
const storedHashedPassword = result.rows[0].password;
bcrypt.compare(password, storedHashedPassword, (err, resp)=>{
    if(err)
        
        console.log(err);
    else {
        if(resp==true){
         
            res.send("User LoggedIn successfully!");
            console.log(`Welcome, RKite!`);
        } else {
            res.send("Incorrect Password!");
            console.log("Incorrect Password, please try again!");
        }
    }
})
    }
})

export default router;