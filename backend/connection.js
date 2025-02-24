import mongoose from "mongoose";

export default async function connection() {
    const db=await mongoose.connect("mongodb://127.0.0.1:27017/"+process.env.DB_NAME,);
    console.log("Connected to database");
    return db;   
}