import pool from "./db.js";
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

app.post("/logs", async (req, res) => {
    const { service, level, message } = req.body;

    // Validate required fields
    if (
        typeof service !== "string" || !service.trim() ||
        typeof level !== "string" || !level.trim() ||
        typeof message !== "string" || !message.trim()
    ) {
        return res.status(400).json({
            error: "service, level, and message are required"
        });
    }

    // Prepare the log
    const log = {
        timestamp: new Date().toISOString(),
        service: service.trim(),
        level: level.trim().toUpperCase(),
        message: message.trim()
    };

    try {
        // Save the log in PostgreSQL
        const result = await pool.query(
            `INSERT INTO logs (timestamp, service, level, message)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [log.timestamp, log.service, log.level, log.message]
        );

        // Return the saved database record
        res.status(201).json({
            message: "Log saved successfully",
            log: result.rows[0]
        });
    } catch (error) {
        console.error("Error saving log:", error.message);

        res.status(500).json({
            error: "Failed to save log"
        });
    }
});







// Get all logs or filter them

app.get("/logs", async (req, res) => {
    const { level, service } = req.query;

    let query = "SELECT * FROM logs WHERE 1=1";
    const values = [];

    // Filter by log level
    if (level) {
        values.push(level.toUpperCase());
        query += ` AND level = $${values.length}`;
    }

    // Filter by service name
    if (service) {
        values.push(service);
        query += ` AND LOWER(service) = LOWER($${values.length})`;
    }

    // Show newest logs first
    query += " ORDER BY timestamp DESC";

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving logs:", error.message);

        res.status(500).json({
            error: "Failed to retrieve logs"
        });
    }
});




app.listen(PORT,()=>{
     console.log(`server is running on port http://localhost:${PORT}`);
});