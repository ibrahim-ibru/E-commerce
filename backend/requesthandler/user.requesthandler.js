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
        console.log(email);
    
      const info = await transporter.sendMail({
        from: 'heyoptimizedstuf@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Welcome to the Future ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Request</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #1a202c; font-family: Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden;">
          <tr>
            <td>
              <div style="padding: 20px; text-align: center; background-color: #4c51bf; color: white; padding: 40px; font-size: 28px; font-weight: bold;">
                Password Reset Request
              </div>
              <div style="color: #e2e8f0; font-size: 16px; margin-top: 20px; text-align: center;">
                We received a request to reset your password. If you made this request, click the button below to reset your password.
                <br />
                If you did not make this request, please ignore this email.
              </div>
              <div style="text-align: center;">
                <a href="http://localhost:5173/setpassword" style="background-color: #4c51bf; color: white; padding: 12px 30px; font-size: 18px; border-radius: 50px; text-decoration: none; display: inline-block; margin-top: 30px; font-weight: bold;">
                  Reset Your Password
                </a>
              </div>
              <div style="font-size: 12px; color: #a0aec0; margin-top: 20px; text-align: center;">
                <p>You're receiving this email because you requested a password reset for your account.</p>
                <p>If you need any help, feel free to contact us at support@yourcompany.com</p>
                <div style="margin-top: 10px;">
                  <a href="https://www.facebook.com" target="_blank" style="color: #a0aec0; margin: 0 10px; text-decoration: none;">Facebook</a> |
                  <a href="https://twitter.com" target="_blank" style="color: #a0aec0; margin: 0 10px; text-decoration: none;">Twitter</a> |
                  <a href="https://www.instagram.com" target="_blank" style="color: #a0aec0; margin: 0 10px; text-decoration: none;">Instagram</a>
                </div>
                <p>&copy; 2025 Your Company. All rights reserved.</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>`, 
      });
    
      return info; // Return the response from the sendMail function
    }
    
    

    export async function changePassword(req, res) {
        console.log("hai change password");
        
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

