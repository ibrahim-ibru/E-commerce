// /backend/middleware/Auth.js
import pkg from "jsonwebtoken";
const {verify}=pkg;
import loginSchema from "../models/login.model.js";
export default async function Auth(req,res,next) {
    try {
        const key=req.headers.authorization;
        if(!key)
            return res.status(403).send({msg:"Unauthorized access"});
        const token=key.split(" ")[1];
        const auth=await verify(token,process.env.JWT_KEY);
        // Check if the user is blocked
        const user = await loginSchema.findOne({ _id: auth.userId });
        if (user && user.isBlocked) {
            return res.status(403).send({ msg: "Your account has been blocked" });
        }
        console.log(user);
        
        req.user=auth;
        next();
    } catch (error) {
        return res.status(403).send({msg:"session expired please log in again"});
    }
}

