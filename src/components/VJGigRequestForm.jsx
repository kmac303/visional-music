import { useState } from "react";

function VJGigRequestForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        eventDate: "",
        venue: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5001/api/vj-gig-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Request submitted successfully!");
            setFormData({ name: "", email: "", phoneNumber: "", eventDate: "", venue: "", message: "" });
        } else {
            alert("Error submitting request.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>VJ Gig Request Form</h2>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Phone Number:
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </label>
            <label>
                Event Date:
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
            </label>
            <label>
                Venue:
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} required />
            </label>
            <label>
                Message:
                <textarea name="message" value={formData.message} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default VJGigRequestForm;