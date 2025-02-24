import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
productname:{type:String, required:true},
price:{type:Number, required:true},
description:{type:String, required:true},
image:{type:String, required:true},
category:{type:String, required:true},
});

export default mongoose.model.product||mongoose.model("product",productSchema)