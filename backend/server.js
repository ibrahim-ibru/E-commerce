import express from "express"
import connection from "./connection.js";
import env from "dotenv";
import cors from "cors"
import router from "./router.js";




env.config();
const app=express();

app.use(express.json());
app.use(cors())
app.use("/api",router)



connection().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server created");
        
    })
}).catch((err)=>{
    console.log("database connection error",err);
})