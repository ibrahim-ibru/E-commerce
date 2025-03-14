// backend/models/product.model.js
import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    sellerId:{type:String},
    category:{type:String},
    pname:{type:String},
    brand:{type:String},
    price:{type:Number},
    sizeQuantities:{type:Object},
    pimages:{type:Array},
    isBlocked: { type: Boolean, default: false }
})

export default mongoose.model.Products || mongoose.model("Product",productSchema);

