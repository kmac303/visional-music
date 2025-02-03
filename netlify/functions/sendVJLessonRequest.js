const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { name, email, phoneNumber, eventDate, venue, message } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Visional" <no-reply@visionalmusic.com>`,
        sender: process.env.EMAIL_USER,
        to: `${email}, ${process.env.EMAIL_USER}`,
        subject: "VJ Gig Request Confirmation",
        text: `Hello ${name},

        Thank you for your VJ gig request! Here are the details you submitted:

        - Message: ${message}
        - Phone Number: ${phoneNumber}
        - Email: ${email}

        I will get back to you shortly!

        Best,
        Kevin (Visional)`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Request submitted and email sent!" }),
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send email" }),
        };
    }
};