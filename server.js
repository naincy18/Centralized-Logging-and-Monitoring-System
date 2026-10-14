import express from "express";
const app=express();
const PORT=3000;


// Allow Express to read JSON request bodies
app.use(express.json());

// Store received logs temporarily in memory
const logs = [];

// Check whether the server is running
app.get("/",(req,res)=>{
     res.send("Centralized logging and monitoring system is running!");
});

// Receive a new log
app.post("/logs",(req,res)=>{
     const log=req.body;
     logs.push(log);
     console.log("New log received:",log);
     res.status(201).json({
          message:"Log received successfully",
          log:log

     });



});
app.get("/logs",(req,res)=>{
     res.json(logs);

});


app.listen(PORT,()=>{
     console.log(`server is running on port http://localhost:${PORT}`);
});