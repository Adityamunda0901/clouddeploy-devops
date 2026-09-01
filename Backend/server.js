const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "clouduser",
    password: process.env.DB_PASSWORD || "cloudpassword",
    database: process.env.DB_NAME || "clouddeploy"
});

app.get("/", (req, res) => {
    res.json({
        message: "CloudDeploy API is running 🚀",
        status: "healthy",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "UP",
            service: "CloudDeploy Backend",
            database: "CONNECTED",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: "DOWN",
            service: "CloudDeploy Backend",
            database: "DISCONNECTED"
        });
    }
});

app.get("/api/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch tasks"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudDeploy API running on port ${PORT}`);
});