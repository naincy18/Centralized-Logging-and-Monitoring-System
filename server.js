import express from "express";
const app=express();
const PORT=3000;
app.get("/",(req,res)=>{
     res.send("Centralized logging and monitoring system is running!");
});
app.listen(PORT,()=>{
     console.log(`server is running on port http://localhost:${PORT}`);
});