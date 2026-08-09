import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json({ type: () => true }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Server is running"
    })
});
export default app;
