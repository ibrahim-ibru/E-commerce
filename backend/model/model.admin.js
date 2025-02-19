import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    email:{type:String, required:true},
    hpassword:{type:String, required:true}
});


export default mongoose.model.admin||mongoose.model("admin",adminSchema)