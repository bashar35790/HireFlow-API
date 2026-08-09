import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./services/products";
dotenv.config();

const app=express();
app.use(cors());
app.use("/", router);
app.use(express.json());
app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Server is running"
    })
});
export default app;
