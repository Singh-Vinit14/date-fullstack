const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test route
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Save user
app.post("/api/users", async (req, res) => {
    try {
        const { name, dob } = req.body;

        if (!name || !dob) {
            return res.status(400).json({
                message: "Name and DOB are required",
            });
        }

        const result = await pool.query(
            "INSERT INTO users (name, dob) VALUES ($1, $2) RETURNING *",
            [name, dob]
        );

        res.status(201).json({
            message: "User saved successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Failed to save user",
        });
    }
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// PostgreSQL connection test
pool
    .query("SELECT NOW()")
    .then(() => {
        console.log("PostgreSQL connected successfully!");
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error.message);
    });