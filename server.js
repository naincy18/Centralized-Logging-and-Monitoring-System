import express from "express";
import cors from "cors";
const app=express();
const PORT=3000;

// Allow requests from the React frontend
app.use(cors());

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

// Get all logs or filter them
app.get("/logs", (req, res) => {
    const { level, service } = req.query;

    let filteredLogs = logs;

    // Filter logs by level
    if (level) {
        filteredLogs = filteredLogs.filter(
            log => log.level === level.toUpperCase()
        );
    }

    // Filter logs by service
    if (service) {
        filteredLogs = filteredLogs.filter(
            log => log.service.toLowerCase() === service.toLowerCase()
        );
    }

    res.json(filteredLogs);
});



app.listen(PORT,()=>{
     console.log(`server is running on port http://localhost:${PORT}`);
});