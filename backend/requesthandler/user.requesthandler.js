import bcrypt from "bcrypt";
import userSchema from "../model/model.user.js";
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";
const { sign } = pkg;


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "heyoptimizedstuf@gmail.com",
      pass: "vfxejmyxhlnuwjke",
    },
  });

export async function userRegistration(req, res) {
    try {
        // Log the incoming request body
        console.log('Request body:', req.body);

        const { name, email, password, cpassword, address, usertype } = req.body;
        console.log(name, email, password, cpassword, address,usertype);

        if (!(name && email && password && cpassword && address  && usertype)) {
            return res.status(400).send({ message: "All fields are required." });
        }

        if (password !== cpassword) {
            return res.status(400).send({ message: "Password and confirm password do not match." });
        }

        console.log("Processing user registration...");
        const data = await userSchema.findOne({ email });

        if (data) {
            return res.status(400).send({ message: "User already exists." });
        }

        const hpassword = await bcrypt.hash(password, 10);
        await userSchema.create({ name, email, password: hpassword, address, usertype });

        return res.status(200).send({ message: "User created successfully." });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
}


export async function userlogin(req, res) {
    const { email, password } = req.body;
    console.log(email, password);

    if (!(email && password)) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        console.log("Processing user login...");
        const data = await userSchema.findOne({ email });
        console.log("data:", data._id);
        
        

        if (!data) {
            return res.status(401).send({ message: "User not found." });
        }

        const hpassword = data.password;
        const result = await bcrypt.compare(password, hpassword);

        if (result) {
            const token = await sign({ id: data._id }, process.env.JWT_KEY, { expiresIn: "1h" });
            return res.status(200).send({ message: "Login successful.",token});
        } else {
            return res.status(401).send({ message: "Invalid password.", data:data._id });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
    }

    export async function getUser(req, res) {    
        const id = req.user.id;
        try {
            const user = await userSchema.findById(id);
            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }
            console.log(user);
            
            return res.status(200).send({user});
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).send({ message: "Something went wrong. Please try again later." });
        }
        
    }


    export async function forgetPassword(req, res) {        
        const {email}=req.body;
        try {
            const user = await userSchema.findOne({email});
            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }
            console.log(user);
            mail(email)
            
            return res.status(200).send({message:"Password sent to your email"});
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).send({ message: "Something went wrong. Please try again later." });
        }
    }



    async function mail(email) {
    
        const info = await transporter.sendMail({
            from: 'heyoptimizedstuf@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          });

          return info
    }


    export async function changePassword(req, res) {
        const {email,password}=req.body;
        try {
            const user = await userSchema.findOne({email});
            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }
            console.log(user);
            const hpassword = await bcrypt.hash(password, 10);
            await userSchema.updateOne({email},{$set:{password:hpassword}});
            return res.status(200).send({message:"Password changed successfully."});
        } catch (error) {
            return res.status(500).send({message:"an error occur at requesthandler : "+error})
        }
    }

