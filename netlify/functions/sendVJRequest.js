require("dotenv").config();
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    // Set CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",  // Allow requests from all domains (update as needed)
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "CORS preflight handled successfully",
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const { name, email, phoneNumber, eventDate, venue, message } = JSON.parse(event.body);

        // Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Your Google Workspace Email
                pass: process.env.EMAIL_PASS // Your App Password
            }
        });

        // Email content
        const mailOptions = {
            from: `"Visional Music" <no-reply@visionalmusic.com>`,  // Send from no-reply alias
            replyTo: process.env.EMAIL_USER,  // Allows replies to your actual email
            to: `${email}, ${process.env.EMAIL_USER}`, // Send to both the user and yourself
            subject: "VJ Gig Request Confirmation",
            text: `Hello ${name},

Thank you for your VJ gig request! Here are the details you submitted:

- Event Date: ${eventDate}
- Venue: ${venue}
- Message: ${message}
- Phone Number: ${phoneNumber}
- Email: ${email}

I will get back to you shortly!

Best,  
Kevin (Visional)`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Request submitted and email sent!" }),
        };

    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to send email" }),
        };
    }
};