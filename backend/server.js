require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 587 for TLS if needed
    secure: true, // Use true for SSL
    auth: {
        user: process.env.EMAIL_USER, // Your Google Workspace Email
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

// Route: Handle VJ Gig Requests
app.post("/api/vj-gig-request", async (req, res) => {
    const { name, email, phoneNumber, eventDate, venue, message } = req.body;

    // Email content
    const mailOptions = {
        from: `"Visional" <no-reply@visionalmusic.com>`,
        sender: process.env.EMAIL_USER,
        to: `${email}, ${process.env.EMAIL_USER}`, // Send to both the user and yourself
        subject: "VJ Gig Request Confirmation",
        text: `Hello ${name},

Thank you for your VJ Gig Request! Here are the details you submitted:

- **Event Date:** ${eventDate}
- **Venue:** ${venue}
- **Message:** ${message}
- **Phone Number:** ${phoneNumber}
- **Email:** ${email}

I will get back to you shortly!

Best,  
Kevin (Visional)
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Request submitted and email sent!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));