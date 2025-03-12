// backend/models/login.model.js
import mongoose from 'mongoose';

const loginSchema=new mongoose.Schema({
    email:{type:String},
    username:{type:String},
    password:{type:String},
    role:{type:String},
    isBlocked: { type: Boolean, default: false }
})

export default mongoose.model.LoginDetails || mongoose.model("LoginDetail",loginSchema);

