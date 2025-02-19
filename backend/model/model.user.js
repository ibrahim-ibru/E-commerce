import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
name:{type:String, required:true},
email:{type:String, required:true},
password:{type:String, required:true},
address:{type:String, required:true},
profile:{type:String, required:true},
usertype:{type:String, required:true}
});

export default mongoose.model.user||mongoose.model("user",userSchema)