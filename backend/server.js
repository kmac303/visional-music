require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Replace with your MongoDB URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Schema & Model
const vjGigSchema = new mongoose.Schema({
    name: String,
    email: String,
    eventDate: String,
    venue: String,
    message: String,
});

const VJGigRequest = mongoose.model("VJGigRequest", vjGigSchema);

// Route: Handle VJ Gig Requests
app.post("/api/vj-gig-request", async (req, res) => {
    try {
        const newRequest = new VJGigRequest(req.body);
        await newRequest.save();
        res.status(201).json({ message: "Request submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit request" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));