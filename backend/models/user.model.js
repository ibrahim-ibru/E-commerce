// backend/models/user.model.js
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userId:{type:String},
    email:{type:String},
    fname:{type:String},
    lname:{type:String},
    gender:{type:String},
    phone:{type:Number},
    isBlocked: { type: Boolean, default: false }
})

export default mongoose.model.Users || mongoose.model("User",userSchema);

