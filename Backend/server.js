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



// CREATE TASK
app.post("/api/tasks", async (req, res) => {
    try {
        const { title, status } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, status)
             VALUES ($1, $2)
             RETURNING *`,
            [title, status || "pending"]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create task"
        });
    }
});

// UPDATE TASK
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 status = COALESCE($2, status)
             WHERE id = $3
             RETURNING *`,
            [title, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update task"
        });
    }
});

// DELETE TASK
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete task"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudDeploy API running on port ${PORT}`);
});