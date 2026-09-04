const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
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