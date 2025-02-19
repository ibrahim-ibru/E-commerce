import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userSchema from "../model/model.user.js";

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
            return res.status(200).send({ message: "Login successful." });
        } else {
            return res.status(401).send({ message: "Invalid password.", data:data._id });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
    }

    export async function getUser(req, res) {    
        const { id } = req.params;
        console.log("id:", id);
        try {
            const user = await userSchema.findById(id);
            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }
            return res.status(200).send({user});
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).send({ message: "Something went wrong. Please try again later." });
        }
        
    }
