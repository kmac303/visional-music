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
        const response = await fetch("/.netlify/functions/sendVJRequest", {
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
        <section>
            <h1>VJ Gig Request Form</h1>
            <h4>Visional is based in Denver, CO.
            If the event is located outside of the Denver metro area, please include in the message if travel/transportation will be provided.</h4>
        <form onSubmit={handleSubmit} action="">
            <div class="form-group">
            <label>
                Artist Name: 
                <input required type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
                Email: 
                <input required placeholder="email@address.com" type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
                Phone Number: 
                <input placeholder="555-555-5555" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
                Event Date: 
                <input required type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} />
            </label>
            <label>
                Venue Info: 
                <input required placeholder="Name and/or Location" type="text" name="venue" value={formData.venue} onChange={handleChange} />
            </label>
            <label>
                Message: 
                <input name="message" value={formData.message} onChange={handleChange} />
            </label>
            </div>
            <button type="submit">Submit</button>
        </form>
        </section>
    );
}

export default VJGigRequestForm;